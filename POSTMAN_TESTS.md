# 📋 Postman Test Cases - Irons Module

## 🔗 Base URL
```
http://localhost:3000/api/irons
```

---

## ✅ Test Case 1: إضافة حديد جديد (POST)

### Method
```
POST
```

### URL
```
http://localhost:3000/api/irons
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "description": "حديد 12 ملم",
  "unit_price": 50.5,
  "incoming": 100,
  "outgoing": 0,
  "balance": 100,
  "total_quantity": 100
}
```

### Expected Response (201)
```json
{
  "success": true,
  "message": "تم إضافة الحديد بنجاح",
  "data": {
    "id": 1,
    "description": "حديد 12 ملم",
    "unitPrice": 50.5,
    "incoming": 100,
    "outgoing": 0,
    "balance": 100,
    "totalQuantity": 100,
    "createdAt": "2025-11-11T10:30:00.000Z",
    "updatedAt": "2025-11-11T10:30:00.000Z"
  }
}
```

---

## ✅ Test Case 2: جلب جميع الحديد (GET)

### Method
```
GET
```

### URL
```
http://localhost:3000/api/irons
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body
```
(لا توجد body في GET requests)
```

### Expected Response (200)
```json
{
  "success": true,
  "message": "تم جلب الحديد بنجاح",
  "data": [
    {
      "id": 1,
      "description": "حديد 12 ملم",
      "unitPrice": 50.5,
      "incoming": 100,
      "outgoing": 0,
      "balance": 100,
      "totalQuantity": 100,
      "createdAt": "2025-11-11T10:30:00.000Z",
      "updatedAt": "2025-11-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "description": "حديد 6 ملم",
      "unitPrice": 35.0,
      "incoming": 50,
      "outgoing": 10,
      "balance": 40,
      "totalQuantity": 50,
      "createdAt": "2025-11-11T10:35:00.000Z",
      "updatedAt": "2025-11-11T10:35:00.000Z"
    }
  ],
  "timestamp": "2025-11-11T10:40:00.000Z"
}
```

---

## ❌ Test Case 3: محاولة إضافة حديد بدون description (Validation Error)

### Method
```
POST
```

### URL
```
http://localhost:3000/api/irons
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "unit_price": 50.5,
  "incoming": 100,
  "outgoing": 0,
  "balance": 100,
  "total_quantity": 100
}
```

### Expected Response (400)
```json
{
  "success": false,
  "status": 400,
  "errorType": "ValidationError",
  "message": "Missing required fields: description",
  "timestamp": "2025-11-11T10:40:00.000Z",
  "path": "/api/irons",
  "method": "POST"
}
```

---

## ❌ Test Case 4: محاولة إضافة حديد برقم غير صحيح (Type Error)

### Method
```
POST
```

### URL
```
http://localhost:3000/api/irons
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "description": "حديد 12 ملم",
  "unit_price": "not a number",
  "incoming": 100,
  "outgoing": 0,
  "balance": 100,
  "total_quantity": 100
}
```

### Expected Response (400)
```json
{
  "success": false,
  "status": 400,
  "errorType": "ValidationError",
  "message": "Field unit_price must be a valid number",
  "timestamp": "2025-11-11T10:40:00.000Z",
  "path": "/api/irons",
  "method": "POST"
}
```

---

## 📊 Test Cases Summary

| رقم | الاختبار | Method | URL | Status | النتيجة |
|------|---------|--------|-----|--------|---------|
| 1 | إضافة حديد جديد | POST | /api/irons | 201 | ✅ نجح |
| 2 | جلب جميع الحديد | GET | /api/irons | 200 | ✅ نجح |
| 3 | خطأ في البيانات المفقودة | POST | /api/irons | 400 | ✅ خطأ متوقع |
| 4 | خطأ في نوع البيانات | POST | /api/irons | 400 | ✅ خطأ متوقع |

---

## 🔄 Postman Collection (JSON)

يمكنك استيراد هذا الـ collection في Postman:

```json
{
  "info": {
    "name": "Irons API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Add Iron",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"description\": \"حديد 12 ملم\",\n  \"unit_price\": 50.5,\n  \"incoming\": 100,\n  \"outgoing\": 0,\n  \"balance\": 100,\n  \"total_quantity\": 100\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/irons",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "irons"]
        }
      }
    },
    {
      "name": "Get All Irons",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/api/irons",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "irons"]
        }
      }
    },
    {
      "name": "Add Iron - Missing Field (Error Test)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"unit_price\": 50.5,\n  \"incoming\": 100,\n  \"outgoing\": 0,\n  \"balance\": 100,\n  \"total_quantity\": 100\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/irons",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "irons"]
        }
      }
    },
    {
      "name": "Add Iron - Invalid Type (Error Test)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"description\": \"حديد 12 ملم\",\n  \"unit_price\": \"not a number\",\n  \"incoming\": 100,\n  \"outgoing\": 0,\n  \"balance\": 100,\n  \"total_quantity\": 100\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/irons",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "irons"]
        }
      }
    }
  ]
}
```

---

## 🛠️ الخطوات لاستيراد الـ Collection في Postman

1. افتح Postman
2. اضغط على **Import** (أعلى اليسار)
3. اختر **Paste Raw Text**
4. انسخ والصق الـ JSON أعلاه
5. اضغط **Import**
6. الآن يمكنك تشغيل جميع الـ Test Cases

---

## 📌 ملاحظات مهمة

### Required Fields للـ POST Request:
- `description` (string) - وصف الحديد
- `unit_price` (number) - سعر الوحدة
- `incoming` (number) - الكمية الواردة
- `outgoing` (number) - الكمية الصادرة
- `balance` (number) - الرصيد
- `total_quantity` (number) - إجمالي الكمية

### أمثلة بيانات واقعية:

#### Iron Type 1 - حديد ثقيل
```json
{
  "description": "حديد 20 ملم - فئة أولى",
  "unit_price": 75.0,
  "incoming": 200,
  "outgoing": 30,
  "balance": 170,
  "total_quantity": 200
}
```

#### Iron Type 2 - حديد خفيف
```json
{
  "description": "حديد 6 ملم - فئة ثانية",
  "unit_price": 35.5,
  "incoming": 500,
  "outgoing": 100,
  "balance": 400,
  "total_quantity": 500
}
```

#### Iron Type 3 - حديد وسط
```json
{
  "description": "حديد 12 ملم - فئة أولى",
  "unit_price": 50.0,
  "incoming": 300,
  "outgoing": 50,
  "balance": 250,
  "total_quantity": 300
}
```

---

## 📝 نصائح للتجربة

✅ **أفضل ممارسات الاختبار:**

1. ابدأ بـ **Test Case 1** (إضافة حديد) أولاً
2. ثم جرب **Test Case 2** (جلب جميع الحديد)
3. تأكد أن الحديد الذي أضفته يظهر في القائمة
4. جرب **Test Cases الأخطاء** (3 و 4)
5. تأكد أن الخطأ يظهر مع الرسالة الصحيحة

✅ **للتحقق من البيانات:**
- يمكنك استخدام database client لعرض البيانات مباشرة
- أو فتح DevTools والتحقق من Network tab

