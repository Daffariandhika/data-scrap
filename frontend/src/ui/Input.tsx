interface InputProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  type?: "text" | "number";
  placeholder?: string;
}

export default function Input<T extends string | number>({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: InputProps<T>) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange((type === "number" ? Number(e.target.value) : e.target.value) as T)
        }
        placeholder={placeholder}
      />
    </div>
  );
}
