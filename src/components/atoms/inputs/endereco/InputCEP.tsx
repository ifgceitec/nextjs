import { cepMask } from '@/utils/masks';
import InputField from '@/components/atoms/InputField';

type Props = {
  register;
  error;
  required?: boolean;
  label?: string;
  name?: string;
};

const InputCEP = ({
  register,
  error,
  required = false,
  label = 'CEP',
  name = 'cep',
}: Props) => {
  return (
    <>
      <InputField
        label={label}
        name={name}
        placeholder="Ex: 00000-000"
        register={register}
        error={error}
        options={{
          onChange: cepMask.onChange,
          required: required,
        }}
      />
    </>
  );
};

export default InputCEP;
