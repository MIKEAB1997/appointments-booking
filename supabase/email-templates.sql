-- ============================================
-- Supabase Email Templates - Hebrew
-- ============================================
--
-- To apply these templates:
-- 1. Go to Supabase Dashboard > Authentication > Email Templates
-- 2. Copy and paste each template into the appropriate section
--
-- Or run these SQL commands in the SQL Editor
-- ============================================

-- ============================================
-- CONFIRMATION EMAIL (אימות אימייל)
-- ============================================
-- Subject: אמת את כתובת האימייל שלך - NextGen
--
-- HTML Template:
/*
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>אמת את האימייל שלך</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF7ED; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px;"></div>
      <h1 style="color: #1F2937; font-size: 24px; margin: 16px 0 0;">NextGen</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #1F2937; font-size: 20px; text-align: center; margin-bottom: 16px;">
      ברוך הבא! 🎉
    </h2>

    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      תודה שנרשמת ל-NextGen!<br>
      לחץ על הכפתור למטה לאימות כתובת האימייל שלך.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="{{ .ConfirmationURL }}"
         style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px;">
        אמת את האימייל שלי
      </a>
    </div>

    <!-- Alternative link -->
    <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
      או העתק את הקישור הבא לדפדפן:
    </p>
    <p style="color: #6B7280; font-size: 12px; word-break: break-all; text-align: center; direction: ltr;">
      {{ .ConfirmationURL }}
    </p>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
      אם לא נרשמת ל-NextGen, התעלם מהודעה זו.
    </p>
  </div>
</body>
</html>
*/

-- ============================================
-- MAGIC LINK EMAIL (קישור התחברות)
-- ============================================
-- Subject: קישור התחברות ל-NextGen
--
-- HTML Template:
/*
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>קישור התחברות</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF7ED; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px;"></div>
      <h1 style="color: #1F2937; font-size: 24px; margin: 16px 0 0;">NextGen</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #1F2937; font-size: 20px; text-align: center; margin-bottom: 16px;">
      קישור התחברות 🔐
    </h2>

    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      הנה הקישור להתחברות לחשבון שלך.<br>
      הקישור תקף ל-60 דקות.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="{{ .ConfirmationURL }}"
         style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px;">
        התחבר עכשיו
      </a>
    </div>

    <!-- Alternative link -->
    <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
      או העתק את הקישור הבא לדפדפן:
    </p>
    <p style="color: #6B7280; font-size: 12px; word-break: break-all; text-align: center; direction: ltr;">
      {{ .ConfirmationURL }}
    </p>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
      אם לא ביקשת קישור התחברות, התעלם מהודעה זו.<br>
      הקישור שלך מאובטח ולא ישותף עם אחרים.
    </p>
  </div>
</body>
</html>
*/

-- ============================================
-- PASSWORD RESET EMAIL (איפוס סיסמה)
-- ============================================
-- Subject: איפוס סיסמה - NextGen
--
-- HTML Template:
/*
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>איפוס סיסמה</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF7ED; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px;"></div>
      <h1 style="color: #1F2937; font-size: 24px; margin: 16px 0 0;">NextGen</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #1F2937; font-size: 20px; text-align: center; margin-bottom: 16px;">
      איפוס סיסמה 🔑
    </h2>

    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      קיבלנו בקשה לאיפוס הסיסמה שלך.<br>
      לחץ על הכפתור למטה לבחירת סיסמה חדשה.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="{{ .ConfirmationURL }}"
         style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px;">
        אפס סיסמה
      </a>
    </div>

    <!-- Security note -->
    <div style="background: #FEF3C7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #92400E; font-size: 14px; margin: 0; text-align: center;">
        ⚠️ הקישור תקף ל-60 דקות בלבד
      </p>
    </div>

    <!-- Alternative link -->
    <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
      או העתק את הקישור הבא לדפדפן:
    </p>
    <p style="color: #6B7280; font-size: 12px; word-break: break-all; text-align: center; direction: ltr;">
      {{ .ConfirmationURL }}
    </p>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
      אם לא ביקשת איפוס סיסמה, התעלם מהודעה זו.<br>
      הסיסמה הנוכחית שלך תישאר ללא שינוי.
    </p>
  </div>
</body>
</html>
*/

-- ============================================
-- INVITE USER EMAIL (הזמנת משתמש)
-- ============================================
-- Subject: הוזמנת להצטרף ל-NextGen
--
-- HTML Template:
/*
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>הזמנה להצטרף</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF7ED; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px;"></div>
      <h1 style="color: #1F2937; font-size: 24px; margin: 16px 0 0;">NextGen</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #1F2937; font-size: 20px; text-align: center; margin-bottom: 16px;">
      הוזמנת להצטרף! 🎉
    </h2>

    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      הוזמנת להצטרף לצוות ב-NextGen.<br>
      לחץ על הכפתור למטה להשלמת ההרשמה.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="{{ .ConfirmationURL }}"
         style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px;">
        קבל את ההזמנה
      </a>
    </div>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
      אם לא ציפית להזמנה זו, אתה יכול להתעלם ממנה.
    </p>
  </div>
</body>
</html>
*/

-- ============================================
-- CHANGE EMAIL EMAIL (שינוי אימייל)
-- ============================================
-- Subject: אמת את כתובת האימייל החדשה - NextGen
--
-- HTML Template:
/*
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>אמת את האימייל החדש</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF7ED; margin: 0; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #F59E0B, #EA580C); border-radius: 16px;"></div>
      <h1 style="color: #1F2937; font-size: 24px; margin: 16px 0 0;">NextGen</h1>
    </div>

    <!-- Content -->
    <h2 style="color: #1F2937; font-size: 20px; text-align: center; margin-bottom: 16px;">
      אמת את האימייל החדש 📧
    </h2>

    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
      קיבלנו בקשה לשנות את כתובת האימייל שלך.<br>
      לחץ על הכפתור למטה לאישור השינוי.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="{{ .ConfirmationURL }}"
         style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px;">
        אשר שינוי אימייל
      </a>
    </div>

    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
      אם לא ביקשת לשנות את האימייל שלך, התעלם מהודעה זו.
    </p>
  </div>
</body>
</html>
*/

-- ============================================
-- INSTRUCTIONS
-- ============================================
--
-- How to apply these templates in Supabase:
--
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Authentication > Email Templates
-- 3. For each template type (Confirm signup, Magic Link, etc.):
--    a. Click on the template type
--    b. Set the Subject line as shown above
--    c. Paste the HTML content (between /* and */)
--    d. Click Save
--
-- 4. Make sure your Site URL is set correctly in:
--    Authentication > URL Configuration
--    Should be: https://app-gamma-mauve.vercel.app
--
-- 5. Set the Redirect URLs (in URL Configuration):
--    - https://app-gamma-mauve.vercel.app/api/auth/callback
--    - https://app-gamma-mauve.vercel.app/auth/reset-password
--
-- ============================================
