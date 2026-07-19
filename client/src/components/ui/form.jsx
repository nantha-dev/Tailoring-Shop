import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Label } from './label';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;

const FormField = ({ name, render, ...props }) => {
  const { control } = useFormContext();
  return render({ field: control.register(name), fieldState: {} });
};

const FormItem = ({ className, ...props }) => <div className={cn('space-y-2', className)} {...props} />;
const FormLabel = ({ className, children, ...props }) => (
  <Label className={cn(className)} {...props}>{children}</Label>
);
const FormMessage = ({ children }) => children ? <p className="text-sm text-red-500">{children}</p> : null;

export { Form, FormField, FormItem, FormLabel, FormMessage };