import InputField from '@/components/atoms/InputField';
import { currencyMask } from '@/utils/masks';

type Props = {
  register;
  error;
  required?: boolean;
  label?: string;
  name?: string;
  labelClassName?: string;
};

const InputSalario = ({
  register,
  error,
  required = false,
  label = 'Salário',
  name = 'salario',
  labelClassName,
}: Props) => {
  return (
    <>
      <InputField
        label={label}
        name={name}
        placeholder="Ex: 2.000,00"
        register={register}
        options={{
          onChange: currencyMask.onChange,
          required: required,
        }}
        labelClassName={labelClassName}
        error={error}
      />
    </>
  );
};

export default InputSalario;
