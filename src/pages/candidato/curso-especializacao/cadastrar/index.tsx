import { useForm } from 'react-hook-form';
import BasicForm from '@/components/atoms/BasicForm';
import CadastroCursoEspecializacao from '@/components/candidato/curso-especializacao/CadastroCursoEspecializacao';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/components/candidato/curso-especializacao/schema';
import { ADMIN, CANDIDATO, SUPERADMIN } from '@/store/auth';
import Router from 'next/router';
import { toastError, toastSuccess } from '@/utils/toasts';
import CursoEspecializacaoService from '@/services/CursoEspecializacaoService';
import { isEmpty } from 'lodash';

type Props = {};

const Index = ({}: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const requestData = {
        ...data,
        certificado: isEmpty(data.certificado) ? null : data.certificado,
      };
      await CursoEspecializacaoService.create(requestData);
      toastSuccess('Curso ou escialização salvo!');
      Router.back();
    } catch (e) {
      toastError('Erro ao salvar curso ou especialização!');
    }
  };

  return (
    <BasicForm
      title={'Curso e Especialização'}
      onSubmit={handleSubmit(onSubmit)}
      component={CadastroCursoEspecializacao}
      register={register}
      errors={errors}
    >
      <button type="button" className="btn btn-base mt-4" onClick={Router.back}>
        voltar
      </button>
      <button type="submit" className="btn btn-primary mt-4 text-white">
        salvar
      </button>
    </BasicForm>
  );
};

Index.permissions = [SUPERADMIN, ADMIN, CANDIDATO];

export default Index;
