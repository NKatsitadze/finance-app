import { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default function Page({ children }: PageProps) {
  return (
    <main
      className="w-full py-8 px-10 flex-1 overflow-y-auto"
    >
      {children}
    </main>
  );
}
