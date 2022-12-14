import CandidatoService from '@/services/CandidatoService';
import { toastError } from '@/utils/toasts';
import { useEffect, useState } from 'react';
import { ICandidatoPerfil } from '@/interfaces/candidato';
import CardPerfilExperienciaProfissional from '@/components/candidato/perfil/CardPerfilExperienciaProfissional';
import CardPerfilObjetivoProfissional from '@/components/candidato/perfil/CardPerfilObjetivoProfissional';
import CardPerfilFormacaoAcademica from '@/components/candidato/perfil/CardPerfilFormacaoAcademica';
import CardPerfilCursoEspecializacao from '@/components/candidato/perfil/CardPerfilCursoEspecializacao';
import CardPerfilIdioma from '@/components/candidato/perfil/CardPerfilIdioma';
import { CANDIDATO } from '@/store/auth';
import CardPerfilDados from '@/components/candidato/perfil/CardPerfilDados';

type Props = {};

const Page = ({}: Props) => {
  const [userProfile, setUserProfile] = useState<ICandidatoPerfil>(
    {} as ICandidatoPerfil,
  );

  const fetchUser = async () => {
    try {
      const data = await CandidatoService.perfil();
      setUserProfile(data);
    } catch (e) {
      toastError(e.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="mb-8 mt-4 mx-auto max-w-3xl">
        <div className="label">
          <span className="label-text">Seu currículo</span>
        </div>
        <div className="space-y-4">
          <CardPerfilDados candidato={userProfile} />

          <CardPerfilObjetivoProfissional
            objetivo_profissional={userProfile?.objetivo_profissional}
          />
          <CardPerfilFormacaoAcademica
            formacao_academica={userProfile?.formacao_academica}
          />
          <CardPerfilExperienciaProfissional
            experiencia_profissional={userProfile?.experiencia_profissional}
          />
          <CardPerfilCursoEspecializacao
            curso_especializacao={userProfile?.curso_especializacao}
          />
          <CardPerfilIdioma idioma={userProfile?.idioma} />
        </div>
      </div>
    </>
  );
};

Page.permissions = [CANDIDATO];

export default Page;
