import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const estilosBase = {
    border: "none",
    borderRadius: "6px",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    fontWeight: 600,
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: "backgorund-color 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const estilosVariantes = {
    primary: { backgroundColor: "#2563eb", color: "#ffffff" },
    secondary: { backgroundColor: "#4b5563", color: "#ffffff" },
    danger: { backgroundColor: "#dc2626", color: "#ffffff" },
  };

  const estilosTamanhos = {
    sm: { padding: "6px 12px", fontSize: "0.85rem" },
    md: { padding: "10px 18px", fontSize: "1rem" },
    lg: { padding: "14px 24px", fontSize: "1.15rem" },
  };

  return (
    <button
      type={type}
      style={{
        ...estilosBase,
        ...estilosVariantes[variant],
        ...estilosTamanhos[size],
      }}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
