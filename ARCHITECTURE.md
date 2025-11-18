# 📋 دليل الهندسة المعمارية - نظام إدارة المخزون المكتبي

## 🏗️ البنية المعمارية (Architecture)

تم إعادة هيكلة المشروع باتباع أفضل الممارسات من مشروع RFID Backend:

```
backend/
 ├── config/
 │   ├── env.js              # متغيرات البيئة
 │   └── prismaClient.js     # Prisma Client Singleton
 ├── modules/
 │   ├── silk_strips/
 │   │   ├── presentation/
 │   │   │   ├── silk_strips.controller.js    # Async functions (لا OOP)
 │   │   │   ├── silk_strips.route.js         # Routes & Validation
 │   │   │   └── silk_strips.validation.js    # Express Validator rules
 │   │   ├── service/
 │   │   │   └── silk_strips.service.js       # Business Logic (Functional)
 │   │   └── repository/
 │   │       └── silk_strips.repository.js    # Database Operations (Functional)
 │   ├── irons/
 │   ├── wires/
 │   ├── stock/
 │   ├── invoices/
 │   ├── dashboard/
 │   └── shared/
 │       ├── filters/
 │       │   └── global_error.filter.js       # Error Handler & Custom Classes
 │       └── utils/
 │           └── calculation.utils.js         # Helper Functions
 ├── prisma/
 │   ├── schema.prisma                        # Database Schema
 │   └── dev.db / dev.db-journal              # SQLite files
 ├── generated/
 │   └── prisma/                              # Prisma Generated Client
 ├── index.js                                 # Main Entry Point
 ├── package.json
 ├── .env
 └── README.md
```

## 🎯 المبادئ الأساسية

### 1️⃣ Functional Programming (بدون OOP)
- **بدون استخدام Classes**: استخدام Arrow Functions و Regular Functions
- **كل function لها مسؤولية واحدة** (Single Responsibility)
- **Separation of Concerns**: فصل الـ Controllers, Services, Repository

### 2️⃣ Layered Architecture
```
Controller (Presentation)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Prisma (ORM)
```

### 3️⃣ Error Handling
```javascript
// Custom Error Classes
- ValidationError (400)
- BusinessLogicError (409)
- NotFoundError (404)
- UnauthorizedError (401)
```

## 📂 شرح كل طبقة

### 📍 Controller Layer (Presentation)

**الملف**: `modules/silk_strips/presentation/silk_strips.controller.js`

```javascript
// ✅ Async Functions فقط - لا OOP
export async function getAllSilkStrips(req, res) {
  const strips = await getAllSilkStripsService();
  res.json(successResponse(strips, 'تم جلب الشرائط الحريرية بنجاح'));
}

// المسؤوليات:
// - التعامل مع HTTP requests/responses
// - استدعاء Service functions
// - إرسال الرد (Response)
```

### 🔧 Service Layer (Business Logic)

**الملف**: `modules/silk_strips/service/silk_strips.service.js`

```javascript
// ✅ Business Logic هنا - Validation, لا DB operations
export async function createSilkStripService(data) {
  // Validation
  if (!data.price || data.price <= 0) {
    throw new ValidationError('السعر مطلوب ويجب أن يكون أكبر من صفر');
  }
  
  // استدعاء Repository
  return await createSilkStrip(data);
}

// المسؤوليات:
// - التحقق من البيانات
// - منطق الأعمال
// - استدعاء Repository functions
// - رفع الأخطاء المناسبة
```

### 💾 Repository Layer (Data Access)

**الملف**: `modules/silk_strips/repository/silk_strips.repository.js`

```javascript
// ✅ Database operations فقط - لا Business Logic
export async function createSilkStrip(data) {
  return await prisma.SilkStrip.create({
    data: {
      loadCapacity: data.loadCapacity,
      safetyFactor: data.safetyFactor,
      // ...
    },
  });
}

// المسؤوليات:
// - الاتصال بقاعدة البيانات
// - إرجاع البيانات الخام
// - لا validation، لا business logic
```

### 🛣️ Routes Layer (Routing & Validation)

**الملف**: `modules/silk_strips/presentation/silk_strips.route.js`

```javascript
// ✅ Async wrapper مدمج مباشرة في Routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  '/', 
  createSilkStripValidation,  // Express Validator rules
  validate,                    // Validation middleware
  asyncHandler(createSilkStrip)  // Controller with error catching
);

// المسؤوليات:
// - تعريف الـ HTTP routes
// - تطبيق Validation rules
// - استدعاء Controllers مع async handling
```

## 🔄 Data Flow

### إضافة منتج جديد (Create)

```
1. POST /api/silk-strips
   ↓
2. Validation Middleware
   - التحقق من البيانات المدخلة
   - إذا فشل: رد 400 Bad Request
   ↓
3. Controller (createSilkStrip)
   - استدعاء Service function
   ↓
4. Service (createSilkStripService)
   - التحقق من Business Logic
   - استدعاء Repository function
   ↓
5. Repository (createSilkStrip)
   - إنشاء في قاعدة البيانات
   ↓
6. إرجاع النتيجة
   - 201 Created مع البيانات
```

## 🛡️ Error Handling

### في Controller:
```javascript
try {
  // asyncHandler يمسك الأخطاء تلقائياً
  const strip = await createSilkStripService(req.body);
  res.status(201).json(successResponse(strip, 'تم الإضافة'));
} catch (error) {
  // يذهب إلى global error handler
  next(error);
}
```

### في Service:
```javascript
if (!data.price || data.price <= 0) {
  throw new ValidationError('السعر غير صحيح');
  // يتم التقاطه في Controller → asyncHandler → global error handler
}
```

### Global Error Handler:
```javascript
export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  
  if (err instanceof ValidationError) {
    statusCode = 400;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
  }
  
  res.status(statusCode).json({
    success: false,
    errorType: err.type,
    message: err.message,
    timestamp: new Date().toISOString(),
  });
};
```

## 📊 Schema Prisma (الجديد)

### من العربية إلى الإنجليزية

```prisma
// ❌ قديم (مشاكل مع PostgreSQL)
model شرائط_حريرية {
  السعر Float
}

// ✅ جديد (يدعم كل الـ databases)
model SilkStrip {
  price Float // تعليق بالعربية
}
```

### الـ Models الجديدة:
- `SilkStrip` (شرائط حريرية)
- `Iron` (حديد)
- `Wire` (ويرات)
- `StockMovement` (حركة مخزون)
- `Invoice` (فاتورة)
- `InvoiceDetail` (تفصيل فاتورة)

## 🔍 Response Format (موحد)

### Success Response:
```json
{
  "success": true,
  "message": "تم جلب الشرائط الحريرية بنجاح",
  "data": [...],
  "timestamp": "2025-11-11T10:30:00Z"
}
```

### Error Response:
```json
{
  "success": false,
  "status": 400,
  "errorType": "ValidationError",
  "message": "السعر مطلوب ويجب أن يكون أكبر من صفر",
  "timestamp": "2025-11-11T10:30:00Z",
  "path": "/api/silk-strips",
  "method": "POST"
}
```

## 📝 مثال عملي - إضافة منتج

### 1️⃣ Controller
```javascript
export async function createSilkStrip(req, res) {
  const strip = await createSilkStripService(req.body);
  res.status(201).json(successResponse(strip, 'تم الإضافة'));
}
```

### 2️⃣ Service
```javascript
export async function createSilkStripService(data) {
  if (!data.price || data.price <= 0) {
    throw new ValidationError('السعر غير صحيح');
  }
  return await createSilkStrip(data);
}
```

### 3️⃣ Repository
```javascript
export async function createSilkStrip(data) {
  return await prisma.SilkStrip.create({
    data: {
      price: data.price,
      loadCapacity: data.loadCapacity,
      incoming: data.incoming || 0,
      totalQuantity: data.incoming || 0,
      balance: data.incoming || 0,
    },
  });
}
```

### 4️⃣ Route
```javascript
router.post(
  '/',
  createSilkStripValidation,
  validate,
  asyncHandler(createSilkStrip)
);
```

## ✅ الفوائد

| الميزة | الشرح |
|------|------|
| **سهولة الصيانة** | كل function لها مسؤولية واحدة |
| **Reusability** | يمكن إعادة استخدام Service/Repository functions |
| **Testing** | سهل كتابة unit tests |
| **Error Handling** | موحد وسهل التتبع |
| **Scalability** | يمكن إضافة modules جديدة بسهولة |
| **Functional** | بدون تعقيدات OOP |

## 🚀 الخطوات التالية

1. تحديث جميع Modules (irons, wires, stock, invoices, dashboard)
2. عمل Database migrations
3. اختبار جميع APIs
4. إضافة unit tests

