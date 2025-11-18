/**
 * حساب الربح = (سعر البيع - سعر الشراء) × الكمية
 */
export const calculateProfit = (سعر_البيع, سعر_الشراء, الكمية) => {
  return (سعر_البيع - سعر_الشراء) * الكمية;
};

/**
 * تحديث الرصيد = اجمالي_عدد - صادر
 */
export const calculateBalance = (اجمالي_عدد, صادر) => {
  return اجمالي_عدد - صادر;
};

/**
 * تحديث إجمالي العدد = وارد
 */
export const calculateTotalStock = (وارد) => {
  return وارد;
};

/**
 * Unified Success Response Format
 */
export const successResponse = (data = null, message = 'تمت العملية بنجاح', meta = null) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Paginated Response Format
 */
export const paginatedResponse = (data, total, page, limit, message = 'تمت العملية بنجاح') => {
  return {
    success: true,
    message,
    data,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * التحقق من توفر المخزون
 */
export const checkStockAvailability = (رصيد, الكمية_المطلوبة) => {
  if (رصيد < الكمية_المطلوبة) {
    return {
      isAvailable: false,
      message: `المخزون غير كافي. الرصيد الحالي: ${رصيد}`,
    };
  }
  return {
    isAvailable: true,
    message: 'المخزون متوفر',
  };
};

/**
 * تحذير عند انخفاض المخزون
 */
export const checkLowStock = (رصيد, الحد_الأدنى = 10) => {
  if (رصيد <= الحد_الأدنى) {
    return {
      isLow: true,
      message: `⚠️ تحذير: المخزون منخفض (${رصيد})`,
    };
  }
  return {
    isLow: false,
    message: 'المخزون جيد',
  };
};
