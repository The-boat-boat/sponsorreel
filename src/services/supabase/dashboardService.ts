import { supabase } from '@/lib/supabase'
import type { DashboardStats, RevenueData, ActivityLogItem } from '@/types'

export const dashboardService = {
  async getStats(operatorId: string): Promise<DashboardStats> {
    // Get current year start
    const currentYear = new Date().getFullYear()
    const yearStart = new Date(currentYear, 0, 1).toISOString()

    // Calculate revenue YTD from payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', yearStart)
      .in('contract_id', 
        supabase
          .from('contracts')
          .select('id')
          .eq('operator_id', operatorId)
      )

    // Calculate previous year revenue for comparison
    const previousYearStart = new Date(currentYear - 1, 0, 1).toISOString()
    const previousYearEnd = new Date(currentYear, 0, 1).toISOString()
    
    const { data: previousPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', previousYearStart)
      .lt('created_at', previousYearEnd)
      .in('contract_id',
        supabase
          .from('contracts')
          .select('id')
          .eq('operator_id', operatorId)
      )

    const revenueYTD = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0) / 100 // Convert cents to dollars
    const previousRevenue = (previousPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0) / 100
    const revenueChange = previousRevenue > 0 
      ? Math.round(((revenueYTD - previousRevenue) / previousRevenue) * 100)
      : 0

    // Count active events (published, future date)
    const today = new Date().toISOString().split('T')[0]
    const { count: activeEventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId)
      .eq('status', 'published')
      .gte('event_date', today)

    // Count previous active events for comparison
    const { count: previousActiveEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId)
      .eq('status', 'published')
      .gte('event_date', today)
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const activeEvents = activeEventsCount || 0
    const activeEventsChange = (previousActiveEvents || 0) > 0
      ? activeEvents - (previousActiveEvents || 0)
      : 0

    // Count pending applications
    const { count: pendingRequestsCount } = await supabase
      .from('sponsorship_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .in('event_id',
        supabase
          .from('events')
          .select('id')
          .eq('operator_id', operatorId)
      )

    // Count previous pending requests for comparison
    const { count: previousPendingRequests } = await supabase
      .from('sponsorship_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .in('event_id',
        supabase
          .from('events')
          .select('id')
          .eq('operator_id', operatorId)
      )
      .lt('submitted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const pendingRequests = pendingRequestsCount || 0
    const pendingRequestsChange = (previousPendingRequests || 0) > 0
      ? pendingRequests - (previousPendingRequests || 0)
      : 0

    return {
      revenueYTD,
      revenueChange,
      activeEvents,
      activeEventsChange,
      pendingRequests,
      pendingRequestsChange
    }
  },

  async getRevenueData(operatorId: string, months = 6): Promise<RevenueData[]> {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueData: RevenueData[] = []

    // Get contracts for this operator
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id')
      .eq('operator_id', operatorId)

    if (!contracts || contracts.length === 0) {
      return revenueData
    }

    const contractIds = contracts.map(c => c.id)

    // Get payments for the last N months
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const { data: payments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'completed')
      .in('contract_id', contractIds)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (!payments) {
      return revenueData
    }

    // Group by month
    const monthlyRevenue: Record<string, number> = {}
    
    payments.forEach(payment => {
      const date = new Date(payment.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (payment.amount || 0)
    })

    // Convert to array format
    Object.keys(monthlyRevenue).sort().forEach(monthKey => {
      const [year, month] = monthKey.split('-')
      revenueData.push({
        month: monthNames[parseInt(month) - 1],
        amount: monthlyRevenue[monthKey] / 100 // Convert cents to dollars
      })
    })

    return revenueData
  },

  async getActivityLog(operatorId: string, limit = 10): Promise<ActivityLogItem[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', operatorId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message || 'Failed to fetch activity log')
    }

    return (data || []) as ActivityLogItem[]
  }
}
