import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AmazonProfitCalculator from '@/components/AmazonProfitCalculator';

export const metadata: Metadata = {
  title: '亚马逊商品利润计算器 | Chaowen Notes',
  description: '调整英、德、法站点的售价、FBA 费用、仓储、头程与采购参数，估算商品利润和保本采购价。',
};

export default function AmazonProfitPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader sticky />
      <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
        <AmazonProfitCalculator />
      </main>
      <SiteFooter />
    </div>
  );
}
