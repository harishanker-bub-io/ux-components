"use client";

import { useCallback, useMemo, useState } from "react";

export const version = "1.0.0";

export interface FormField {
  label: string;
  name?: string;
  required?: boolean;
  type?: "text" | "email" | "textarea" | "tel" | "url";
  placeholder?: string;
}

export interface ContactFormProps {
  /** Form title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Submit button text */
  submitText?: string;
  /** List of fields as an array of objects */
  fields?: FormField[];
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

type FormValues = { [key: string]: string };

const DEFAULT_FIELDS: FormField[] = [
  { label: "Name", required: true },
  { label: "Email", required: true, type: "email" },
  { label: "Message", required: true, type: "textarea" },
];

function isTextarea(fieldName: string): boolean {
  const lower = fieldName.toLowerCase();
  return (
    lower === "message" ||
    lower === "description" ||
    lower === "comments" ||
    lower === "notes" ||
    lower === "details"
  );
}

export default function ContactForm({
  title = "Contact Us",
  subtitle = "We'd love to hear from you. Send us a message.",
  submitText = "Send Message",
  fields = DEFAULT_FIELDS,
  dispatch,
}: ContactFormProps) {
  const parsedFields = useMemo(() => {
    return fields.map((f) => {
      const id = f.name || f.label;
      return {
        id,
        label: f.label,
        required: !!f.required,
        type:
          f.type ||
          (isTextarea(f.label)
            ? "textarea"
            : f.label.toLowerCase().includes("email")
            ? "email"
            : f.label.toLowerCase().includes("phone") ||
              f.label.toLowerCase().includes("tel")
            ? "tel"
            : f.label.toLowerCase().includes("website") ||
              f.label.toLowerCase().includes("url")
            ? "url"
            : "text"),
        placeholder: f.placeholder || `Enter ${f.label.toLowerCase()}...`,
      };
    });
  }, [fields]);

  const emptyForm: FormValues = {};
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleChange = useCallback((fieldId: string, value: string) => {
    setValues((prev: FormValues) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => prev.filter((id) => id !== fieldId));
  }, []);

  const handleSubmit = useCallback(() => {
    const missing = parsedFields
      .filter((f) => f.required && !values[f.id]?.trim())
      .map((f) => f.id);

    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    setErrors([]);
    setSubmitted(true);
    dispatch?.("submit", values);
  }, [dispatch, values, parsedFields]);

  if (submitted) {
    return (
      <div className="ux:w-80 ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-lg ux:overflow-hidden">
        <div className="ux:flex ux:flex-col ux:items-center ux:gap-3 ux:py-10 ux:px-7 ux:text-center">
          <div className="ux:w-14 ux:h-14 ux:rounded-full ux:bg-emerald-50 ux:flex ux:items-center ux:justify-center ux:text-2xl ux:text-emerald-500">
            &#10003;
          </div>
          <p className="ux:text-lg ux:font-semibold ux:text-slate-900">
            Thank you!
          </p>
          <p className="ux:text-sm ux:text-slate-500">
            Your message has been sent successfully.
          </p>
          <button
            type="button"
            className="ux:mt-3 ux:px-5 ux:py-2.5 ux:rounded-lg ux:bg-slate-100 ux:text-slate-800 ux:text-sm ux:font-semibold ux:cursor-pointer ux:border-none ux:transition-colors hover:ux:bg-slate-200"
            onClick={() => {
              setSubmitted(false);
              setValues({});
            }}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ux:w-96 ux:rounded-2xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-lg ux:overflow-hidden">
      <div className="ux:px-7 ux:pt-7">
        <h3 className="ux:text-xl ux:font-semibold ux:text-slate-900 ux:m-0">
          {title}
        </h3>
        {subtitle && (
          <p className="ux:text-sm ux:text-slate-500 ux:mt-1 ux:m-0">
            {subtitle}
          </p>
        )}
      </div>

      <div className="ux:flex ux:flex-col ux:gap-4 ux:px-7 ux:pt-5 ux:pb-7">
        {parsedFields.map((field) => {
          const hasError = errors.includes(field.id);
          return (
            <div key={field.id} className="ux:flex ux:flex-col ux:gap-1.5">
              <label className="ux:text-sm ux:font-medium ux:text-slate-700">
                {field.label}
                {field.required && (
                  <span className="ux:text-rose-500 ux:ml-1">*</span>
                )}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className={`ux:w-full ux:px-3 ux:py-2.5 ux:rounded-lg ux:border ux:text-sm ux:text-slate-900 ux:outline-none ux:resize-y ux:min-h-20 ux:transition-colors focus:ux:border-slate-400 ${
                    hasError
                      ? "ux:border-rose-500 ux:bg-rose-50"
                      : "ux:border-slate-200 ux:bg-slate-50"
                  }`}
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  className={`ux:w-full ux:px-3 ux:py-2.5 ux:rounded-lg ux:border ux:text-sm ux:text-slate-900 ux:outline-none ux:transition-colors focus:ux:border-slate-400 ${
                    hasError
                      ? "ux:border-rose-500 ux:bg-rose-50"
                      : "ux:border-slate-200 ux:bg-slate-50"
                  }`}
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="ux:w-full ux:py-3 ux:rounded-xl ux:border-none ux:text-sm ux:font-semibold ux:cursor-pointer ux:transition-colors ux:bg-slate-900 ux:text-white ux:mt-1 hover:ux:bg-slate-800"
          onClick={handleSubmit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
}
