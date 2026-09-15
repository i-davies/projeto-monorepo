import type { ChangeEvent } from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  helperText,
  required = false,
}: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginBottom: "16px",
        textAlign: "left",
      }}
    >
      <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: `1px solid ${error ? "#dc2626" : "#d1d5db"}`,
          outline: "none",
          fontSize: "1rem",
          transition: "border-color 0.2s",
        }}
      />
      {error ? (
        <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
