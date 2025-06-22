import Button from "./DesignSystem/Button";

type HeaderProps = {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export default function Header({ title, buttonLabel, onButtonClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8 py-2">
      <h1 className="text-preset-1 font-bold">{title}</h1>
      {buttonLabel && (
        <Button label={buttonLabel} onButtonClick={onButtonClick}/>
      )}
    </div>
  );
}
