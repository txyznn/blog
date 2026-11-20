'use client';

import { useId, useState, type ReactNode } from 'react';
import { Calculator, ChevronDown, Globe2, Package, RotateCcw, Ship, Warehouse } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  calculateProfit, createDefaultInput, validateInput, resolveFbaFee,
  type Marketplace, type ProfitInput, type ProfitResult,
} from '@/lib/amazon-profit';

const money = (value: number, currency = 'CNY') => new Intl.NumberFormat('zh-CN', {
  style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(value);
const number = (value: number, digits = 2) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: digits }).format(value);
const percent = (value: number | null) => value === null ? '—' : `${value.toFixed(2)}%`;

function Field({ label, value, onChange, unit, min = 0, max, step = 'any', hint }: {
  label: string; value: number; onChange: (value: number) => void;
  unit?: string; min?: number; max?: number; step?: number | 'any'; hint?: string;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <div className="relative">
        <Input id={id} type="number" value={Number.isNaN(value) ? '' : value} min={min} max={max} step={step}
          onChange={(event) => onChange(event.target.value === '' ? NaN : Number(event.target.value))}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-invalid={!Number.isFinite(value) || value < min || (max !== undefined && value > max)}
          className={cn('h-11 text-base tabular-nums', unit && 'pr-16')} />
        {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{unit}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-5 text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: [string, string][];
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          {options.map(([key, name]) => <option key={key} value={key}>{name}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: ReactNode }) {
  return <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm leading-6"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 shrink-0 accent-[var(--primary)]" />{children}</label>;
}

function Section({ title, description, icon, children }: { title: string; description: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm md:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">{icon}</span>
        <div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
      </div>
      {children}
    </section>
  );
}

export default function AmazonProfitCalculator() {
  const [input, setInput] = useState(createDefaultInput);
  const [selectedSite, setSelectedSite] = useState('uk');
  const site = input.marketplaces.find((item) => item.id === selectedSite)!;
  const fbaMatch = resolveFbaFee(input, site);
  const set = <K extends keyof ProfitInput>(key: K, value: ProfitInput[K]) => setInput((current) => ({ ...current, [key]: value }));
  const setSite = <K extends keyof Marketplace>(key: K, value: Marketplace[K]) => setInput((current) => ({
    ...current, marketplaces: current.marketplaces.map((item) => item.id === selectedSite ? { ...item, [key]: value } : item),
  }));
  const errors = validateInput(input);
  const result = errors.length ? null : calculateProfit(input);
  const symbol = site.currency === 'GBP' ? '£' : '€';

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><Calculator className="size-4" />实用工具 / 跨境电商</p>
          <h1 className="serif text-3xl font-bold tracking-tight md:text-4xl">亚马逊商品利润计算器</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">从售价到采购，把每一笔费用算清楚。调整下方参数，即时比较三个站点的收益。</p>
        </div>
        <Button variant="outline" onClick={() => { setInput(createDefaultInput()); setSelectedSite('uk'); }}><RotateCcw />恢复案例默认值</Button>
      </div>

      <div className="mb-8 rounded-lg border border-primary/20 bg-accent/60 px-5 py-4 text-sm leading-6 text-muted-foreground">
        <span className="font-semibold text-foreground">图片费率预设</span> · FBA 基础配送费按所提供图片中的尺寸、单件重量和各站点含税售价自动匹配，尺寸会按长边到短边排序。汇率与其他费用沿用案例，不是实时数据。附加费仍单独计算；不符合低价计划的商品可选择正常配送或手动报价。
      </div>

      {result && <div className="mb-8 grid gap-4 sm:grid-cols-3" aria-live="polite" aria-atomic="true">
        <Metric label="预计总利润" value={money(result.profit)} detail={`${result.quantity} 件商品 · ${input.includeAdvertising ? '已扣广告费用' : '未计广告费用'}`} prominent negative={result.profit < 0} />
        <Metric label="销售利润率" value={percent(result.margin)} detail="预计利润 ÷ 不含 VAT 销售额" />
        <Metric label="保本采购单价" value={money(result.breakEvenPurchasePrice)} detail={result.breakEvenPurchasePrice < 0 ? '采购价为零仍无法保本' : '已扣所选费用后，每件可用于采购的金额'} />
      </div>}

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <Section title="商品与采购" description="单件包装尺寸与重量，用于计算仓储体积和头程费用。" icon={<Package className="size-5" />}>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              <Field label="包装长度" value={input.length} onChange={(value) => set('length', value)} unit="cm" min={0.001} max={100000} />
              <Field label="包装宽度" value={input.width} onChange={(value) => set('width', value)} unit="cm" min={0.001} max={100000} />
              <Field label="包装高度" value={input.height} onChange={(value) => set('height', value)} unit="cm" min={0.001} max={100000} />
              <Field label="单件重量" value={input.weight} onChange={(value) => set('weight', value)} unit="g" min={0.001} max={100000} />
              <Field label="采购单价" value={input.purchasePrice} onChange={(value) => set('purchasePrice', value)} unit="¥/件" />
              <Field label="包装费用" value={input.packagingPrice} onChange={(value) => set('packagingPrice', value)} unit="¥/件" />
            </div>
            {result && <p className="mt-5 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">单件体积 <strong className="font-medium text-foreground">{number(result.unitVolume * 1e6, 3)} cm³</strong> / {number(result.unitVolume, 7)} m³，合计 {result.quantity} 件，实重 {number(result.actualWeight)} kg。</p>}
          </Section>

          <Section title="仓储周期与优惠" description="时间统一按北京时间；按日分摊各月仓储费，默认入库和出库当天均计费。" icon={<Warehouse className="size-5" />}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">入库时间<Input type="datetime-local" min="1900-01-01T00:00" max="2100-12-31T23:59" value={input.arrival} onChange={(event) => set('arrival', event.target.value)} className="mt-2 h-11 text-base" /></label>
              <label className="block text-sm font-medium">出库时间<Input type="datetime-local" min="1900-01-01T00:00" max="2100-12-31T23:59" value={input.departure} onChange={(event) => set('departure', event.target.value)} className="mt-2 h-11 text-base" /></label>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Check checked={input.includeArrival} onChange={(value) => set('includeArrival', value)}>计入入库当天</Check>
              <Check checked={input.includeDeparture} onChange={(value) => set('includeDeparture', value)}>计入出库当天</Check>
            </div>
            <fieldset className="mt-6"><legend className="mb-3 text-sm font-medium">旺季月份 <span className="font-normal text-muted-foreground">· 未选月份使用淡季费率</span></legend>
              <div className="flex flex-wrap gap-2">{Array.from({ length: 12 }, (_, index) => index + 1).map((month) => <button key={month} type="button" aria-pressed={input.peakMonths.includes(month)} aria-label={`${month}月旺季`} onClick={() => set('peakMonths', input.peakMonths.includes(month) ? input.peakMonths.filter((item) => item !== month) : [...input.peakMonths, month])} className={cn('min-w-12 rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring', input.peakMonths.includes(month) ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent')}>{month}月</button>)}</div>
            </fieldset>
            <div className="mt-6 rounded-lg border border-border p-4">
              <Check checked={input.newProduct} onChange={(value) => set('newProduct', value)}><span className="font-medium">启用新品仓储优惠</span></Check>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">默认减免全部仓储费；部分减免可调整比例。需自行确认数量与优惠期限符合计划。</p>
              {input.newProduct && <div className="mt-4 max-w-xs"><Field label="仓储费减免比例" value={input.storageDiscountPercent} onChange={(value) => set('storageDiscountPercent', value)} unit="%" max={100} /></div>}
            </div>
          </Section>

          <Section title="站点销售与平台费用" description="分别设置站点参数；关闭站点后，其销量与费用均不计入汇总。" icon={<Globe2 className="size-5" />}>
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="选择编辑站点">{input.marketplaces.map((item) => <button key={item.id} type="button" aria-pressed={item.id === selectedSite} onClick={() => setSelectedSite(item.id)} className={cn('rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring', item.id === selectedSite ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent')}>{item.name} · {item.currency}{!item.enabled && '（已关闭）'}</button>)}</div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><h3 className="font-semibold">{site.name}站参数</h3><Check checked={site.enabled} onChange={(value) => setSite('enabled', value)}>计入此站点</Check></div>
            <fieldset disabled={!site.enabled} className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 disabled:opacity-50">
              <legend className="sr-only">{site.name}站费用设置</legend>
              <Field label="商品数量" value={site.quantity} onChange={(value) => setSite('quantity', value)} unit="件" min={1} max={1000000} step={1} />
              <Field label="含 VAT 售价" value={site.price} onChange={(value) => setSite('price', value)} unit={`${symbol}/件`} />
              <Field label={`汇率（1 ${site.currency}）`} value={site.exchangeRate} onChange={(value) => setSite('exchangeRate', value)} unit="CNY" min={0.0001} max={100000} />
              <Field label="VAT 税率" value={site.vatPercent} onChange={(value) => setSite('vatPercent', value)} unit="%" max={100} />
              <Field label="销售佣金比例" value={site.commissionPercent} onChange={(value) => setSite('commissionPercent', value)} unit="%" max={100} />
              <SelectField label="FBA 配送费模式" value={site.fulfillmentMode} onChange={(value) => setSite('fulfillmentMode', value as Marketplace['fulfillmentMode'])} options={[[ 'auto', '自动匹配图片费率' ], [ 'normal', '只用正常配送费' ], [ 'manual', '手动填写报价' ]]} />
              <Field label="燃油与物流附加费" value={site.surchargePercent} onChange={(value) => setSite('surchargePercent', value)} unit="%" max={100} />
              <SelectField label="仓储计费单位" value={site.storageUnit} onChange={(value) => setSite('storageUnit', value as Marketplace['storageUnit'])} options={[[ 'ft3', '每立方英尺 / 月' ], [ 'm3', '每立方米 / 月' ]]} />
              <div className="hidden md:block" />
              <Field label="淡季仓储费率" value={site.offPeakRate} onChange={(value) => setSite('offPeakRate', value)} unit={symbol} hint={`${site.currency} / ${site.storageUnit === 'ft3' ? 'ft³' : 'm³'} / 月；变更单位时请同步调整费率。`} />
              <Field label="旺季仓储费率" value={site.peakRate} onChange={(value) => setSite('peakRate', value)} unit={symbol} />
            </fieldset>
            <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6">
              <p className="font-medium">{fbaMatch.label}{fbaMatch.fee !== null && ` · ${money(fbaMatch.fee, site.currency)} / 件（基础费）`}</p>
              <p className="mt-1 text-muted-foreground">{fbaMatch.reason}</p>
              {site.fulfillmentMode === 'manual' && <fieldset disabled={!site.enabled} className="mt-4 max-w-xs"><Field label="FBA 基础配送费" value={site.fulfillmentFee} onChange={(value) => setSite('fulfillmentFee', value)} unit={`${symbol}/件`} /></fieldset>}
              {fbaMatch.fee !== null && Number.isFinite(site.surchargePercent) && <p className="mt-2 text-muted-foreground">加收 {number(site.surchargePercent)}% 附加费后：{number(fbaMatch.fee * (1 + site.surchargePercent / 100), 4)} {site.currency} / 件。</p>}
            </div>
            <div className="mt-6 border-t border-border pt-5"><SelectField label="佣金计算基数（所有站点）" value={input.commissionBasis} onChange={(value) => set('commissionBasis', value as ProfitInput['commissionBasis'])} options={[[ 'gross', '含 VAT 销售额（案例口径）' ], [ 'net', '不含 VAT 销售额' ]]} /></div>
          </Section>

          <Section title="头程与其他费用" description="头程按整批货物计费；采购和包装按单件计费，广告与其他费用按总额计入。" icon={<Ship className="size-5" />}>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              <SelectField label="运输方式" value={input.transport} onChange={(value) => set('transport', value as ProfitInput['transport'])} options={[[ 'sea', '海运' ], [ 'air', '空运' ], [ 'rail', '铁路' ], [ 'express', '快递' ]]} />
              <SelectField label="头程计费方式" value={input.freightBasis} onChange={(value) => set('freightBasis', value as ProfitInput['freightBasis'])} options={[[ 'actual', '商品实重' ], [ 'volumetric', '体积重' ], [ 'higher', '实重与体积重取大' ]]} />
              <Field label="头程费率" value={input.freightRate} onChange={(value) => set('freightRate', value)} unit="¥/kg" />
              <Field label="体积重系数" value={input.volumetricDivisor} onChange={(value) => set('volumetricDivisor', value)} min={1} hint="体积重 kg = 长 × 宽 × 高 cm ÷ 系数" />
              <Field label="整批最低计费重量" value={input.minimumWeight} onChange={(value) => set('minimumWeight', value)} unit="kg" />
              <Field label="其他费用总额" value={input.otherCosts} onChange={(value) => set('otherCosts', value)} unit="¥" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">运输方式用于记录方案，切换后请手动填写报价。体积重按单件包装汇总，外箱毛重或实际报价差额可填入其他费用。</p>
            <div className="mt-5 rounded-lg border border-border p-4">
              <Check checked={input.includeAdvertising} onChange={(value) => set('includeAdvertising', value)}><span className="font-medium">计入广告费用</span></Check>
              {input.includeAdvertising ? <div className="mt-4 max-w-xs"><Field label="广告费用总额" value={input.advertising} onChange={(value) => set('advertising', value)} unit="¥" /></div> : <p className="mt-1 text-sm text-muted-foreground">案例预设 ¥600，启用后从利润中扣除。</p>}
            </div>
          </Section>
        </div>

        <aside className="min-w-0 space-y-5 xl:sticky xl:top-24" aria-label="利润汇总">
          {result ? <Summary result={result} input={input} /> : <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-6"><h2 className="font-semibold text-destructive">请完善参数后查看结果</h2><ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        </aside>
      </div>

      {result && <Details result={result} input={input} />}
      <details className="mt-7 rounded-xl border border-border bg-card p-5 text-sm leading-7 md:p-7">
        <summary className="cursor-pointer font-semibold">计算公式与案例说明</summary>
        <div className="mt-4 space-y-2 text-muted-foreground">
          <p>不含 VAT 销售额 = 含税售价 × 数量 ÷ (1 + VAT 税率)。默认佣金按含税销售额计算；配送费 = 基础费 × (1 + 附加费率) × 数量。</p>
          <p>FBA 图片费率：轻型信封 ≤33×23×2.5cm，重量分为 20 / 40 / 60 / 80 / 100g；标准信封同尺寸，分为 210 / 460g；小包裹 ≤33×25×12cm，分为 150 / 400 / 900g；标准包裹 ≤45×34×26cm，分为 150 / 400 / 900 / 1400g。按尺寸档位顺序匹配，并包含边界值。</p>
          <p>低价售价上限：英国 £10、德国 €11、法国 €12。低价表中小包裹 900g 和标准包裹各档为空，使用正常配送表。按约定，长中边符合 33×23cm 时，厚度超过 2.5cm 至 4cm 优先走大信封，超过 4cm 至 6cm 走超大信封，这两档不另设重量上限；厚度超过 6cm 或其余边长不符合信封条件时，按包裹尺寸与克重匹配。厚度不超过 2.5cm 但超过 460g 的商品也进入包裹匹配。超出图表范围时请手动报价。</p>
          <p>月度仓储费 = 站点总体积 × 月费率 × 当月计费天数 ÷ 当月自然日数。默认所有商品在同一时间出库，按所选起止日期计入库存日，时间不按小时折算；1 m³ = 35.31466672 ft³。</p>
          <p>预计利润 = 不含 VAT 销售额 − 佣金 − 配送费 − 减免后仓储费 − 头程费 − 采购费 − 包装费 − 已启用广告费 − 其他费用。利润率以不含 VAT 销售额为分母，成本利润率以全部已列成本为分母。</p>
          <p>保本采购单价 = 扣除采购以外所有已选成本后的剩余 ÷ 总件数。负值表示零采购价也无法保本；分母为零的比率显示为「—」。所有中间金额保留精度，仅展示时四舍五入。</p>
          <p>原案例仓储合计 ¥465.04 只加了英国和一个欧元站点；三个站点按未舍入数据计算合计约 ¥674.35。原案例部分成本与利润混用了不同口径，本页统一按公式计算，因此默认结果会与原文有小幅差异。</p>
          <p>本工具按所填报价估算。新品优惠与低价 FBA 资格、退货、数字服务费等不会自动判定，实际发生的额外费用请自行计入。</p>
        </div>
      </details>
    </>
  );
}

function Metric({ label, value, detail, prominent = false, negative = false }: { label: string; value: string; detail: string; prominent?: boolean; negative?: boolean }) {
  return <div className={cn('rounded-xl border p-5 md:p-6', prominent ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card')}><p className={cn('text-sm', prominent ? 'opacity-85' : 'text-muted-foreground')}>{label}</p><p className={cn('mt-3 text-3xl font-semibold tracking-tight tabular-nums', negative && !prominent && 'text-destructive')}>{value}</p><p className={cn('mt-3 text-xs leading-5', prominent ? 'opacity-85' : 'text-muted-foreground')}>{detail}</p></div>;
}

function Summary({ result, input }: { result: ProfitResult; input: ProfitInput }) {
  const costs = [
    { label: '销售佣金', value: result.commission, color: 'bg-blue-500' },
    { label: 'FBA 配送', value: result.fulfillment, color: 'bg-indigo-500' },
    { label: '仓储', value: result.storage, color: 'bg-cyan-500' },
    { label: '头程', value: result.freight, color: 'bg-amber-500' },
    { label: '采购', value: result.purchase, color: 'bg-emerald-500' },
    { label: '包装及其他', value: result.packaging + input.otherCosts, color: 'bg-slate-500' },
    { label: '广告', value: result.advertising, color: 'bg-rose-500' },
  ];
  return <>
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5"><h2 className="text-lg font-semibold">收益账单 <span className="float-right mt-1 text-xs font-normal text-muted-foreground">统一折算 CNY</span></h2></div>
      <div className="space-y-3 p-5 text-sm">
        <Row label="含 VAT 销售额" value={money(result.gross)} />
        <Row label="销项 VAT" value={`− ${money(result.vat)}`} muted />
        <Row label="不含 VAT 销售额" value={money(result.net)} strong />
        <div className="my-4 border-t border-dashed border-border" />
        {costs.map((cost) => <Row key={cost.label} label={cost.label} value={`− ${money(cost.value)}`} muted />)}
        <div className="my-4 border-t border-border" />
        <Row label="已列总成本" value={money(result.totalCosts)} strong />
        <div className={cn('rounded-lg px-4 py-4', result.profit < 0 ? 'bg-destructive/10 text-destructive' : 'bg-accent text-primary')}><Row label={result.profit < 0 ? '预计亏损' : '预计利润'} value={money(result.profit)} strong /></div>
        <Row label="单件利润" value={money(result.profitPerUnit)} />
        <Row label="成本利润率" value={percent(result.costReturn)} />
      </div>
    </section>
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold">成本构成</h2>
      <div className="my-4 flex h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">{costs.filter((cost) => cost.value > 0).map((cost) => <div key={cost.label} className={cost.color} style={{ width: `${cost.value / result.totalCosts * 100}%` }} />)}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">{costs.filter((cost) => cost.value > 0).map((cost) => <div key={cost.label} className="flex items-center gap-2"><span aria-hidden="true" className={cn('size-2 rounded-sm', cost.color)} /><span className="text-muted-foreground">{cost.label}</span><span className="ml-auto tabular-nums">{(cost.value / result.totalCosts * 100).toFixed(1)}%</span></div>)}</div>
    </section>
    <section className="rounded-xl border border-primary/20 bg-accent/50 p-5">
      <h2 className="mb-4 font-semibold">新品优惠对比</h2>
      <div className="space-y-3 text-sm"><Row label="不享受优惠" value={money(result.oldProductProfit)} /><Row label={`减免 ${number(input.storageDiscountPercent)}% 仓储费`} value={money(result.discountedProductProfit)} strong /><Row label="可增加利润" value={`+ ${money(result.discountedProductProfit - result.oldProductProfit)}`} /></div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">两种方案均使用当前广告和其他费用设置，仅比较仓储减免的差异。</p>
    </section>
  </>;
}

function Row({ label, value, muted = false, strong = false }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return <div className={cn('flex items-baseline justify-between gap-3', strong && 'font-semibold')}><span className={muted ? 'text-muted-foreground' : ''}>{label}</span><span className="shrink-0 tabular-nums">{value}</span></div>;
}

function Details({ result, input }: { result: ProfitResult; input: ProfitInput }) {
  return <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
    <div className="p-5 md:p-7"><h2 className="text-lg font-semibold">站点费用明细</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">各站点费用以本币展示，销售剩余尚未扣除头程、采购、包装、广告与其他费用。</p></div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-right text-sm tabular-nums">
        <caption className="sr-only">已启用站点的销售与平台费用</caption>
        <thead className="border-y border-border bg-muted text-muted-foreground"><tr>{['站点 / 数量', '含税销售额', '不含税销售额', '佣金', 'FBA 配送', '仓储费', '销售剩余', '剩余折合 CNY'].map((label, i) => <th key={label} scope="col" className={cn('whitespace-nowrap px-5 py-4 font-medium', i === 0 && 'text-left')}>{label}</th>)}</tr></thead>
        <tbody>{result.sites.map((site) => <tr key={site.id} className="border-b border-border last:border-0"><th scope="row" className="px-5 py-5 text-left font-medium">{site.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{site.quantity} 件 · {site.currency}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{site.fulfillmentMatch.label} · {money(site.fulfillmentFee, site.currency)}/件</span></th>{[site.gross, site.net, site.commission, site.fulfillment, site.storage, site.remaining].map((value, i) => <td key={i} className="whitespace-nowrap px-5 py-5">{money(value, site.currency)}</td>)}<td className="whitespace-nowrap px-5 py-5 font-medium">{money(site.remaining * site.exchangeRate)}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="grid gap-4 border-t border-border bg-muted/40 p-5 text-sm sm:grid-cols-3 md:px-7">
      <div><p className="text-muted-foreground">销售剩余合计</p><p className="mt-1 font-semibold tabular-nums">{money(result.remaining)}</p></div>
      <div><p className="text-muted-foreground">头程计费重量 / 费用</p><p className="mt-1 font-semibold tabular-nums">{number(result.billableWeight)} kg / {money(result.freight)}</p></div>
      <div><p className="text-muted-foreground">可用于采购的余额</p><p className="mt-1 font-semibold tabular-nums">{money(result.beforePurchase)}</p></div>
    </div>
    <details className="border-t border-border p-5 md:px-7">
      <summary className="cursor-pointer text-sm font-medium">展开每月仓储计算 · 共 {result.months.reduce((sum, month) => sum + month.days, 0)} 个库存日</summary>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">体积 × 当月费率 × 库存日数 / 当月自然日数。下表展示减免前费用；当前减免 {input.newProduct ? input.storageDiscountPercent : 0}%。</p>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[530px] text-right text-sm tabular-nums"><caption className="sr-only">每月仓储费用计算（减免前）</caption><thead><tr className="border-b border-border"><th scope="col" className="py-3 text-left font-medium">月份 / 费率</th><th scope="col" className="px-3 font-medium">库存日 / 当月天数</th>{result.sites.map((site) => <th key={site.id} scope="col" className="px-3 font-medium">{site.name} ({site.currency})</th>)}</tr></thead><tbody>{result.months.map((month, index) => <tr key={month.label} className="border-b border-border"><th scope="row" className="py-3 text-left font-normal">{month.label} · {month.peak ? '旺季' : '淡季'}</th><td className="px-3">{month.days} / {month.monthDays}</td>{result.sites.map((site) => <td key={site.id} className="px-3">{money(site.monthlyStorage[index].cost, site.currency)}</td>)}</tr>)}</tbody><tfoot><tr><th scope="row" className="py-4 text-left font-medium">减免前合计</th><td />{result.sites.map((site) => <td key={site.id} className="px-3 font-medium">{money(site.storageBeforeDiscount, site.currency)}</td>)}</tr></tfoot></table></div>
      <div className="mt-2 grid gap-2 text-sm text-muted-foreground">{result.sites.map((site) => <p key={site.id}>{site.name}总体积 {number(site.volume, 6)} {site.storageUnit === 'ft3' ? 'ft³' : 'm³'} · 淡季 {money(site.offPeakRate, site.currency)} / 旺季 {money(site.peakRate, site.currency)} 每月</p>)}</div>
    </details>
  </section>;
}
