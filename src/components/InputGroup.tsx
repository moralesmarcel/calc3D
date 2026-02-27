import type { ReactNode } from 'react';

type InputGroupProps = {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  theme: {
    card: string;
    border: string;
    text: string;
  };
};

export function InputGroup({ label, icon, children, theme }: InputGroupProps) {
  return (
    // Bloco visual que agrupa campos relacionados (ex.: energia, material, etc.).
    <section
      className="mb-4 rounded-xl border p-5 shadow-sm transition-colors duration-300"
      style={{ backgroundColor: theme.card, borderColor: theme.border }}
    >
      {/* Cabeçalho do grupo com ícone + título para facilitar entendimento do usuário. */}
      <div className="mb-4 flex items-center gap-2 font-semibold" style={{ color: theme.text }}>
        {icon}
        <span>{label}</span>
      </div>

      {/* Área onde os InputField são renderizados em layout responsivo. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
