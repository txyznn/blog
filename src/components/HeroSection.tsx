import { ArrowRight, Github, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        </div>
        <div className="mt-10 flex items-center gap-5 text-foreground/70">
          <a aria-label="GitHub" href="#">
            <Github size={20} />
          </a>
          <a aria-label="微信" href="#">
            <MessageCircle size={20} />
          </a>
          <a aria-label="CSDN" href="#" className="text-xs font-bold tracking-normal">
            CSDN
          </a>
        </div>
      </div>
    </section>
  );
}
