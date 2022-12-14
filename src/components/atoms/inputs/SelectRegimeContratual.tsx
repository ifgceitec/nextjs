import SelectField from '@/components/atoms/SelectField';
import { IChoice, RegimeContratualChoices } from '@/utils/choices';

type Props = {
  register;
  error;
  required?: boolean;
  label?: string;
  name?: string;
  choices?: IChoice[];
  labelClassName?: string;
};

const SelectRegimeContratual = ({
  register,
  error,
  required = false,
  label = 'Regime de contratação',
  name = 'regime_contratual',
  choices,
  labelClassName,
}: Props) => {
  const regimeContratualChoices = [
    {
      label: 'Selecione o regime de contratação',
      value: '',
      selected: true,
      disabled: true,
    },
    ...RegimeContratualChoices.choices,
  ];

  return (
    <>
      <SelectField
        label={label}
        name={name}
        register={register}
        error={error}
        labelClassName={labelClassName}
        choices={choices?.length > 0 ? choices : regimeContratualChoices}
        options={{
          required: required,
        }}
      />
    </>
  );
};

export default SelectRegimeContratual;
