import { useForm } from 'react-hook-form';
import { clamp, classNames, objectFormData } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/components/vaga/cadastro/schema';
import Stepper from '@/components/atoms/Stepper';
import CardFormWrapper from '@/components/atoms/CardFormWrapper';
import CadastroVagaSobre from '@/components/vaga/cadastro/CadastroVagaSobre';
import CadastroVagaInformacoes from '@/components/vaga/cadastro/CadastroVagaInformacoes';
import CadastroVagaSalarioBeneficios from '@/components/vaga/cadastro/CadastroVagaSalarioBeneficios';
import { ADMIN, EMPREGADOR, SUPERADMIN } from '@/store/auth';
import { toastError, toastSuccess } from '@/utils/toasts';
import BeneficioService from '@/services/BeneficioService';
import Router from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
import { omitBy } from 'lodash';
import VagaService from '@/services/VagaService';

type Props = {};

const CadastroVaga = ({}: Props) => {
  const [step, setStep] = useState(0);
  const startForm = useRef(null);
  const steps = [
    'Sobre a Vaga',
    'Salário e Benefícios',
    'Informações Categóricas',
    // 'Currículos',
  ];
  const [beneficios, setBeneficios] = useState([]);
  const recaptchaRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const recaptchaValue = await recaptchaRef.current.executeAsync();

    try {
      let requestData = omitBy(data, (v) => !v);
      requestData['recaptcha'] = recaptchaValue;
      requestData = objectFormData(requestData);

      await VagaService.create(requestData as FormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toastSuccess('Vaga criada!');
      Router.back();
    } catch (e) {
      toastError('Erro ao criar vaga!');
    }

    recaptchaRef.current.reset();
  };

  const fetchBeneficios = async () => {
    try {
      const { results } = await BeneficioService.getAll();
      setBeneficios(results.map((i) => ({ label: i.nome, value: i.id })));
    } catch (e) {
      toastError('Erro ao buscar benefícios');
    }
  };

  const changeStep = async (value) => {
    if (value > step) {
      const validateForm = {
        0: async () =>
          await trigger([
            'regime_contratual',
            'cargo',
            'atividades',
            'requisitos',
            'pessoa_deficiencia',
          ]),
        1: async () => await trigger(['salario', 'beneficios']),
        2: async () =>
          await trigger([
            'jornada_trabalho',
            'modelo_trabalho',
            'sexo',
            'idade_minima',
            'idade_maxima',
            'quantidade_vagas',
          ]),
        // 3: async () => await trigger(['curriculos']),
      };

      const result = await validateForm[step]();

      startForm.current.scrollIntoView({ behavior: 'smooth' });
      if (!result) return;
    }

    startForm.current.scrollIntoView({ behavior: 'smooth' });
    setStep(clamp(value, 0, steps.length - 1));
  };

  useEffect(() => {
    fetchBeneficios();
  }, []);

  return (
    <CardFormWrapper
      title="Cadastro de Vaga"
      subtitle={<i className="hidden" ref={startForm} />}
    >
      <Stepper steps={steps} changeStep={changeStep} currentStep={step} />
      <div className="divider divider-horizontal my-4"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step == 0 && <CadastroVagaSobre register={register} errors={errors} />}
        {step == 1 && (
          <CadastroVagaSalarioBeneficios
            register={register}
            errors={errors}
            beneficios={beneficios}
          />
        )}
        {step == 2 && (
          <CadastroVagaInformacoes register={register} errors={errors} />
        )}
        {/* {step == 3 && (
          <CadastroVagaCurriculos
            register={register}
            errors={errors}
            watch={watch}
          />
        )} */}

        <div className="flex flex-wrap justify-between mt-4">
          <ReCAPTCHA
            badge="inline"
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY}
            ref={recaptchaRef}
          />

          <div className="space-x-4 ml-auto">
            <button
              type="button"
              className={classNames(step != 0 && 'hidden', 'btn btn-base mt-4')}
              onClick={Router.back}
            >
              cancelar
            </button>
            <button
              onClick={() => changeStep(step - 1)}
              type="button"
              className={classNames(step == 0 && 'hidden', 'btn btn-base mt-4')}
            >
              voltar
            </button>

            <button
              onClick={() => changeStep(step + 1)}
              type="button"
              className={classNames(
                step == steps.length - 1 && 'hidden',
                'btn btn-primary mt-4 text-white',
              )}
            >
              continuar
            </button>
            <button
              type="submit"
              className={classNames(
                step < steps.length - 1 && 'hidden',
                'btn btn-primary mt-4 text-white',
              )}
            >
              cadastrar
            </button>
          </div>
        </div>
      </form>
    </CardFormWrapper>
  );
};

CadastroVaga.permissions = [SUPERADMIN, ADMIN, EMPREGADOR];
export default CadastroVaga;
