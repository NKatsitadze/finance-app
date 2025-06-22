import { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default function Page({ children }: PageProps) {
  return (
    <main
      className="w-full h-full flex flex-col py-8 px-10 flex-1 overflow-y-auto "
    >
      {children}
    </main>
  );
}
