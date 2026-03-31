import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Upload, CheckCircle2 } from 'lucide-react';

interface FileUploadFieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
}

export default function FileUploadField({
  id,
  label,
  hint,
  required,
  onChange,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file?.name ?? null);
    onChange(file);
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div
        className={cn(
          'flex items-center gap-3 cursor-pointer rounded-md border-2 border-dashed px-4 py-3 transition-colors hover:border-primary hover:bg-accent',
          fileName ? 'border-green-400 bg-green-50' : 'border-input'
        )}
        onClick={() => inputRef.current?.click()}
      >
        {fileName ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <span className={cn('text-sm truncate', fileName ? 'text-green-700' : 'text-muted-foreground')}>
          {fileName ?? 'Click to select a file…'}
        </span>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
