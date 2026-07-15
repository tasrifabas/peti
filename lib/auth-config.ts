// Peti dipakai oleh satu orang, jadi login disederhanakan jadi "PIN saja".
// Di balik layar, PIN tetap dikirim sebagai password ke satu akun Supabase
// Auth tetap (email di bawah), supaya RLS & keamanan storage tetap berlaku
// seperti biasa. Kamu harus membuat akun ini sekali di Supabase Dashboard:
//   Authentication -> Users -> Add user
//     Email    : owner@peti.local
//     Password : (PIN kamu, mis. Bontet9495)
//     Centang "Auto Confirm User"
export const APP_LOGIN_EMAIL = "owner@peti.local";
