import { ReactNode } from 'react';
import Button from '../DesignSystem/Button';

type DetailItem = {
  label: string;
  amount: string | number;
  color: string;
  key: string | number;
};

type OverviewCardProps = {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: ReactNode;
  details?: DetailItem[];
  layout?: 'horizontal' | 'horizontal-full' | 'grid';
};

export default function OverviewCard({
  title,
  buttonLabel,
  onButtonClick,
  children,
  details,
  layout,
}: OverviewCardProps) {
  return (
    <div className="p-8 bg-white rounded-xl shadow w-full">
      {/* Title and button */}
      <div className="flex justify-between items-start mb-5">
        <h2 className="text-preset-2 font-bold">{title}</h2>
        {buttonLabel && onButtonClick && (
          <Button type='tertiary' onButtonClick={onButtonClick} label={buttonLabel}/>
        )}
      </div>

      {/* Content layout */}
      <div className={`${layout === 'grid' || layout === 'horizontal' ? 'grid grid-cols-2 gap-4' : ''}`}>
        <div className="flex-grow">{children}</div>

        {details && <div
          className={`flex-shrink-0 ${
            layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'
          }`}
        >
          {details.map((item) => (
            <div key={item.key} className={`flex flex-col relative pl-4 rounded-xl ${layout === 'horizontal-full' ? `border-l-4 pr-4 pt-5 pb-5 flex flex-row justify-between` : ''}`} style={{backgroundColor: layout === 'horizontal-full' ? 'var(--beige-100)' : undefined, borderColor: layout === 'horizontal-full' ? item.color : ''}}>
              <span className={`absolute w-[4px] rounded-xl h-full top-0 left-0 ${layout === 'horizontal-full' ? 'hidden' : ''}`} style={{ backgroundColor: item.color }}></span>
              <span className="text-preset-4" style={ { color: 'var(--grey-500)' } }>{item.label}</span>
              <span className="text-preset-4 bold" style={ { color: 'var(--grey-900)' } }>
                {item.amount}
              </span>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
