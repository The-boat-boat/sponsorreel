import type { DashboardStats, RevenueData, ActivityLogItem } from '@/types'
import { demoDashboardStats, demoRevenueData, demoActivityLog } from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const dashboardService = {
  async getStats(_operatorId: string): Promise<DashboardStats> {
    await delay(250)
    return { ...demoDashboardStats }
  },
  
  async getRevenueData(_operatorId: string, _months = 6): Promise<RevenueData[]> {
    await delay(300)
    return [...demoRevenueData]
  },
  
  async getActivityLog(_operatorId: string, limit = 10): Promise<ActivityLogItem[]> {
    await delay(200)
    return demoActivityLog.slice(0, limit)
  }
}
