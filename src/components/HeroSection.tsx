import Image, { type StaticImageData } from 'next/image';
import { ArrowRight, Github } from 'lucide-react';
import paymentQrCode from '@/asset/payment-qr-code.png';
import wechatQrCode from '@/asset/wechat-qr-code.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function QrTooltip({ id, image, alt, className }: {
  id: string;
  image: StaticImageData;
  alt: string;
  className: string;
}) {
  return (
    <div
      id={id}
      role="tooltip"
      className={cn(
        'invisible absolute bottom-full z-20 w-52 pb-2 group-focus-within:visible group-hover:visible',
        className,
      )}
    >
      <div className="rounded-lg border border-border bg-white p-2 shadow-lg">
        <Image src={image} alt={alt} unoptimized className="h-auto w-full rounded-sm" />
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero-bg relative isolate min-h-[490px] overflow-hidden px-7 py-20 md:min-h-[525px] md:px-16 md:py-28">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/vedioes/hero-sim-car.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="relative z-10 max-w-[510px]">
        <p className="mb-5 text-sm font-semibold text-primary">
          HELLO, I&apos;M CHAOWEN
        </p>
        <h1 className="serif text-[48px] font-semibold leading-[1.12] md:text-[68px]">
          <span className="block">数据驱动</span>
          <span className="block">世界引擎</span>
        </h1>
        <p className="mt-7 max-w-md text-base leading-8 text-foreground/70">
          From Simulation to Reality.
          <br />
          从仿真出发，走向真实世界。
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#content">
              阅读最新文章 <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#关于我">
              认识我 <ArrowRight data-icon="inline-end" />
            </a>
          </Button>
          <div className="max-[479px]:basis-full">
            <div className="group relative w-fit">
              <Button type="button" size="lg" variant="outline" aria-describedby="hero-payment-qr" className="text-sm! font-medium!">
                打赏博主 <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
              <QrTooltip
                id="hero-payment-qr"
                image={paymentQrCode}
                alt="微信收款二维码"
                className="left-0 min-[480px]:left-auto min-[480px]:right-0"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-5 text-foreground/70">
          <a aria-label="GitHub" href="https://github.com/txyznn">
            <Github size={20} />
          </a>
          <div className="group relative flex items-center">
            <button
              type="button"
              aria-label="微信"
              aria-describedby="hero-wechat-qr"
              className="rounded-sm text-[#07c160] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {/* WeChat logo from Simple Icons. */}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
              </svg>
            </button>
            <QrTooltip id="hero-wechat-qr" image={wechatQrCode} alt="微信好友二维码" className="left-0" />
          </div>
          <a aria-label="CSDN" href="https://blog.csdn.net/qq_41127869" className="text-xs font-bold tracking-normal">
            CSDN
          </a>
        </div>
      </div>
    </section>
  );
}
