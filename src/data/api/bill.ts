import type { ApiResponse, BillQueryParams, BillRecord, PaginatedResponse } from '@/data/types'

// 生成 mock 账单数据
function generateMockBills(source: 'WX' | 'ZFB', count = 20): BillRecord[] {
  const records: BillRecord[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const base: BillRecord = {
      id: i + 1 + Math.floor(Math.random() * 10000),
      source,
      tradeTime: new Date(now - i * 86_400_000).toISOString().slice(0, 19).replace('T', ' '),
      incomeExpense: i % 3 === 0 ? 'INCOME' : 'EXPENSE',
      amount: parseFloat((Math.random() * 1000 + 0.01).toFixed(2)),
      remark: '',
      tradeNo: `${source}${Date.now()}${i}`,
    }

    if (source === 'WX') {
      base.counterparty = ['张三', '美团外卖', '滴滴出行', '瑞幸咖啡', '京东'][i % 5]
      base.product = ['餐饮', '交通', '购物', '饮品', '数码'][i % 5]
      base.wxType = ['商户消费', '转账', '红包', '扫码'][i % 4]
      base.paymentMethod = ['零钱', '银行卡', '零钱通'][i % 3]
      base.status = ['已支付', '已退款', '支付中'][i % 3]
      base.merchantNo = `M${Date.now()}${i}`
    } else {
      base.category = ['餐饮', '交通', '购物', '转账', '生活缴费'][i % 5]
      base.zfbAccount = ['余额宝', '银行卡', '花呗'][i % 3]
      base.alipaySource = ['扫码支付', '商家扣款', '手动记账'][i % 3]
      base.alipayTags = ['餐饮', '日常', '出行', '购物'][i % 4]
    }

    records.push(base)
  }
  return records
}

// POST /api/bills/import — 上传文件导入
export async function uploadBill(file: File): Promise<ApiResponse<null>> {
  // TODO: 替换为真实 API 调用
  console.log('Uploading file:', file.name)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '导入成功', data: null })
    }, 500)
  })
}

// GET /api/bills — 分页查询
export async function fetchBills(params: BillQueryParams): Promise<ApiResponse<PaginatedResponse<BillRecord>>> {
  // TODO: 替换为真实 API 调用: GET /api/bills?page=${params.page}&pageSize=${params.pageSize}&source=${params.source}
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: {
          records: generateMockBills(params.source),
          total: 58,
          page: params.page,
          pageSize: params.pageSize,
        },
      })
    }, 300)
  })
}
