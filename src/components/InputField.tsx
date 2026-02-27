import type { ChangeEvent, FocusEvent } from 'react';

type InputFieldProps = {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  suffix?: string;
  step?: number;
  type?: 'number' | 'text';
  theme: {
    bg: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
  };
};

export function InputField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  type = 'number',
  theme
}: InputFieldProps) {
  return (
    <div>
      {/* Rótulo visível para explicar ao usuário o que deve ser preenchido no campo. */}
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
        {label} {suffix ? `(${suffix})` : ''}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          // Se o campo for numérico, convertemos para número para manter os cálculos corretos.
          // Se for texto, mantemos a string como digitada.
          const nextValue = type === 'number' ? Number(event.target.value) || 0 : event.target.value;
          onChange(nextValue);
        }}
        step={step}
        className="w-full rounded-lg border px-3 py-2 transition-all focus:outline-none"
        style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
        onFocus={(event: FocusEvent<HTMLInputElement>) => {
          // Feedback visual ao focar: melhora usabilidade para quem está preenchendo.
          event.target.style.boxShadow = `0 0 0 2px ${theme.accent}`;
          event.target.style.borderColor = theme.accent;
        }}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          // Ao sair do campo, removemos o destaque para voltar ao estilo normal.
          event.target.style.boxShadow = 'none';
          event.target.style.borderColor = theme.border;
        }}
      />
    </div>
  );
}
