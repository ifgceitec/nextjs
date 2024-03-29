import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { clamp, classNames, objectFormData } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/components/candidato/cadastro/schema';
import CadastroCandidatoDadosPessoais from '@/components/candidato/cadastro/CadastroCandidatoDadosPessoais';
import Stepper from '@/components/atoms/Stepper';
import CadastroCandidatoDadosContato from '@/components/candidato/cadastro/CadastroCandidatoDadosContato';
import CadastroCandidatoCandidatura from '@/components/candidato/cadastro/CadastroCandidatoCandidatura';
import CardFormWrapper from '@/components/atoms/CardFormWrapper';
import CardNotification from "@/components/atoms/CardNotification";
import { GUEST, useAuthStore } from '@/store/auth';
import { toastError, toastSuccess } from '@/utils/toasts';
import CandidatoService from '@/services/CandidatoService';
import { format } from 'date-fns';
import Router, { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
import { omitBy } from 'lodash';
import { BiError } from "react-icons/bi";

type Props = {};

type FormProps = {
  nome: string;
  data_nascimento: string;
  cpf: string;
  sexo: string;
  estado_civil: string;
  possui_deficiencia: string;
  email: string;
  telefone: string;
  password: string;
  confirm_password: string;
  cargo: string;
  salario: string;
  modelo_trabalho: string;
  regime_contratual: string;
  jornada_trabalho: string;
};

const Index = ({}: Props) => {
  const [step, setStep] = useState(0);
  const login = useAuthStore((state) => state.login);
  const startForm = useRef(null);
  const steps = ['Dados Pessoais', 'Dados de Contato', 'Candidatura'];
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    // values: {
    //   jornada_trabalho: 1,
    //   regime_contratual: 2,
    //   modelo_trabalho: 1,
    //   salario: 2000,
    //   cargo: 'Analista',
    //   confirm_password: 'Admin1234)',
    //   password: 'Admin1234)',
    //   telefone: '98988751446',
    //   email: 'raquel_carvalho@uninet.com.br',
    //   possui_deficiencia: false,
    //   estado_civil: 1,
    //   sexo: 1,
    //   cpf: '64751788450',
    //   data_nascimento: '1952-05-01',
    //   nome: 'Raquel Marcela Carvalho',
    // }
  });

  const loginAction = async (data: FormProps) => {
    const { cpf, password } = data;

    try {
      await login(cpf, password);
      toastSuccess('Login realizado!');
      await router.push({ pathname: '/' });
    } catch (e) {
      toastError('Erro ao realizar login!');
    }
  };
  const onSubmit = async (data) => {
    const recaptchaValue = await recaptchaRef.current.executeAsync();

    try {
      let requestData = {
        ...data,
        data_nascimento: format(data.data_nascimento, 'yyyy-MM-dd'),
        salario: parseFloat(data.salario),
        recaptcha: recaptchaValue,
        curriculo: data.curriculo ? data.curriculo[0] : null,
      };

      requestData = omitBy(requestData, (value) => !Boolean(value));

      requestData = objectFormData(requestData);

      await CandidatoService.create(requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toastSuccess('Cadastro realizado!');
      await loginAction(data);
    } catch (error) {
      toastError('Erro ao realizar cadastro!');
      recaptchaRef.current.reset();
    }
  };

  const changeStep = async (value) => {
    if (value > step) {
      const validateForm = {
        0: async () =>
          await trigger([
            'nome',
            'data_nascimento',
            'cpf',
            'sexo',
            'estado_civil',
            'possui_deficiencia',
            'tipo_deficiencia',
          ]),
        1: async () =>
          await trigger(['email', 'telefone', 'password', 'confirm_password']),
        2: async () =>
          await trigger([
            'cargo',
            'salario',
            'modelo_trabalho',
            'regime_contratual',
            'jornada_trabalho',
          ]),
      };

      const result = await validateForm[step]();

      startForm.current.scrollIntoView({ behavior: 'smooth' });

      if (!result) return;
    }

    startForm.current.scrollIntoView({ behavior: 'smooth' });
    setStep(clamp(value, 0, 2));
  };

  const subTitle = (
    <p
      ref={startForm}
      className={classNames(step == 0 ? 'lg:ml-auto' : 'hidden')}
    >
      Cadastre-se como{' '}
      <Link
        href={'/empresa/cadastrar'}
        className="link link-hover text-primary"
      >
        Empresa
      </Link>
    </p>
  );


  return (
    <div>
      <CardNotification title="Atenção"
                        subtitle={'Ferramenta aguardando liberação de uso. '}>
        <div>
          <p>
            Ferramenta aguardando liberação de uso.
            Quando liberada, daremos início à divulgação das redes sociais do IFG
            e da Prefeitura de Anápolis. Contudo, é possível testar a feramenta com os seguintes usuários testes:
          </p>
          <div className={"alert my-1 mx-1 flex flex-row"}
            // @ts-ignore
               style={{ justifyContent:"space-around !important" }}>
            <div className={""}>
              Empresa<br/>login: 828.736.230-04<br/>senha:Senha@123
            </div>
            <div className="flex bg-black border" style={{ height: "100px" }} >
              <div className="vr bg-black border"></div>
            </div>
            <div className={""}> Candidato<br/>login: 073.190.591-18<br/>senha:Senha@123</div>
          </div>
          <div className="space-x-4 ml-auto grid"
               style={{ alignItems:"center", justifyItems:"center" }}>
            <button
              type="button"
              className={classNames(step != 0 && 'hidden', 'btn btn-base mt-4')}
              onClick={Router.back}
            >
              ok
            </button>
          </div>
        </div>
      </CardNotification>
      {/*  <CardFormWrapper title="Cadastro de Candidato" subtitle={subTitle}>*/}
      {/*  <Stepper steps={steps} changeStep={changeStep} currentStep={step} />*/}
      {/*  <div className="divider divider-horizontal my-4"></div>*/}
      {/*  <form onSubmit={handleSubmit(onSubmit)}>*/}
      {/*    {step == 0 && (*/}
      {/*      <CadastroCandidatoDadosPessoais*/}
      {/*        register={register}*/}
      {/*        errors={errors}*/}
      {/*        watch={watch} />*/}
      {/*    )}*/}
      {/*    {step == 1 && (*/}
      {/*      <CadastroCandidatoDadosContato register={register} errors={errors} />*/}
      {/*    )}*/}
      {/*    {step == 2 && (*/}
      {/*      <CadastroCandidatoCandidatura register={register} errors={errors} />*/}
      {/*    )}*/}

      {/*    <div className="flex flex-wrap justify-between mt-4">*/}
      {/*      <ReCAPTCHA*/}
      {/*        badge="inline"*/}
      {/*        size="invisible"*/}
      {/*        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY}*/}
      {/*        ref={recaptchaRef} />*/}

      {/*      <div className="space-x-4 ml-auto">*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          className={classNames(step != 0 && "hidden", "btn btn-base mt-4")}*/}
      {/*          onClick={Router.back}*/}
      {/*        >*/}
      {/*          cancelar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          onClick={() => changeStep(step - 1)}*/}
      {/*          type="button"*/}
      {/*          className={classNames(step == 0 && "hidden", "btn btn-base mt-4")}*/}
      {/*        >*/}
      {/*          voltar*/}
      {/*        </button>*/}

      {/*        <button*/}
      {/*          onClick={() => changeStep(step + 1)}*/}
      {/*          type="button"*/}
      {/*          disabled={true}*/}
      {/*          className={classNames(*/}
      {/*            step == steps.length - 1 && "hidden",*/}
      {/*            "btn btn-primary mt-4 text-white"*/}
      {/*          )}*/}
      {/*        >*/}
      {/*          continuar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          type="submit"*/}
      {/*          className={classNames(*/}
      {/*            step < steps.length - 1 && "hidden",*/}
      {/*            "btn btn-primary mt-4 text-white"*/}
      {/*          )}*/}
      {/*        >*/}
      {/*          cadastrar*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*</CardFormWrapper>*/}
    </div>
  );
};

Index.permissions = [GUEST];

export default Index;
