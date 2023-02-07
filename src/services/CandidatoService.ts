import axiosInstance from '@/utils/axios';
import {
  ICandidato,
  ICandidatoCreate,
  ICandidatoList,
  ICandidatoPerfil,
} from '@/interfaces/candidato';
import CRLUDService from '@/services/CRLUDService';

class CandidatoService extends CRLUDService<
  ICandidatoCreate,
  ICandidato,
  ICandidatoList,
  ICandidatoCreate,
  ICandidatoCreate
> {
  constructor() {
    super('candidato');
  }

  async perfil(): Promise<ICandidatoPerfil> {
    const { data } = await axiosInstance.get(`${this.baseUrl}/perfil`);

    if (data?.objetivo_profissional) {
      data.objetivo_profissional = {
        ...data.objetivo_profissional,
        salario: parseFloat(data?.objetivo_profissional?.salario)
          .toFixed(2)
          .replace('.', ','),
      };
    }

    return data;
  }

  async getAll(query?: any) {
    let data = await super.getAll(query);

    data.results.forEach((candidato) => {
      candidato.objetivo_profissional.salario = parseFloat(
        candidato.objetivo_profissional.salario,
      )
        .toFixed(2)
        .replace('.', ',');
    });

    return data;
  }

  async getRecs(query?: any) {
    let { data } = await axiosInstance.get(`${this.baseUrl}/rec`,{
      params: query,
    });

    data.results.forEach((candidato: ICandidatoPerfil) => {
      candidato.objetivo_profissional.salario = parseFloat(
        candidato.objetivo_profissional.salario,
      )
        .toFixed(2)
        .replace('.', ',');
    });

    return data;
  }

}

export default new CandidatoService();
