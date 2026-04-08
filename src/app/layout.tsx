import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tloud — AI ตอบแชทลูกค้า 24 ชม.',
  description: 'แพลตฟอร์ม AI สำหรับธุรกิจไทย ตอบแชทลูกค้าอัตโนมัติ ผ่าน LINE OA ตั้งค่า 3 คลิก ไม่ต้องเขียนโค้ด เริ่มต้นฟรี',
  openGraph: {
    title: 'Tloud — AI ตอบแชทลูกค้า 24 ชม.',
    description: 'แพลตฟอร์ม AI สำหรับธุรกิจไทย ตอบแชทลูกค้าอัตโนมัติ ผ่าน LINE OA',
    locale: 'th_TH',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Facebook Pixel — replace YOUR_PIXEL_ID with actual pixel ID */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
                (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init','${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track','PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="bg-white text-text antialiased">
        {children}
      </body>
    </html>
  );
}
