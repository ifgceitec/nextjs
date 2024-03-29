import InputRazaoSocial from '@/components/atoms/inputs/InputRazaoSocial';
import InputCNPJ from '@/components/atoms/inputs/InputCNPJ';
import InputNomeFantasia from '@/components/atoms/inputs/InputNomeFantasia';
import InputRamoAtividade from '@/components/atoms/inputs/InputRamoAtividade';
import InputTelefone from '@/components/atoms/inputs/InputTelefone';
import InputEmail from '@/components/atoms/inputs/InputEmail';
import InputSite from '@/components/atoms/inputs/InputSite';
import InputNumeroFuncionarios from '@/components/atoms/inputs/InputNumeroFuncionarios';
import TextAreaField from '@/components/atoms/TextAreaField';
import { IEmpresa } from '@/interfaces/empresa';
import InputUploadImage from '@/components/atoms/InputUploadImage';

type Props = {
  register: any;
  errors: any;
  editMode?: boolean;
  watch: any;
  setValue?: any;
  handlers?: {
    onPartialSubmit: (data) => Promise<IEmpresa>;
  };
};

const CadastroEmpresaDadosEmpresa = ({
  register,
  errors,
  editMode,
  watch,
  handlers,
  setValue,
}: Props) => {
  return (
    <>
      {editMode && (
        <InputUploadImage
          register={register('foto')}
          error={errors.foto?.message}
          watch={watch}
          onDelete={() => {
            handlers.onPartialSubmit({ foto: new File([], '') }).then(() => {
              setValue('foto', null);
            });
          }}
          onSubmit={(e) => {
            handlers
              .onPartialSubmit({ foto: e.target.files[0] })
              .then((data) => {
                setValue('foto', data?.foto);
              });
          }}
        />
      )}
      <InputCNPJ
        register={register}
        error={errors.cnpj?.message}
        required={true}
      />
      <InputRazaoSocial
        register={register}
        error={errors.razao_social?.message}
        required={true}
      />
      <InputNomeFantasia
        register={register}
        error={errors.nome_fantasia?.message}
        required={true}
      />
      <InputRamoAtividade
        register={register}
        error={errors.ramo_atividade?.message}
        required={true}
      />
      {editMode && (
        <>
          <InputTelefone
            label="Telefone Comercial"
            register={register}
            error={errors.telefone?.message}
            required={true}
          />
          <InputEmail
            label="E-mail Comercial"
            register={register}
            error={errors.email?.message}
            required={true}
          />
          <InputSite register={register} error={errors.site?.message} />
        </>
      )}
      <InputNumeroFuncionarios
        register={register}
        error={errors.numero_funcionarios?.message}
      />

      <TextAreaField
        label="Descrição"
        name="descricao"
        register={register}
        error={errors.descricao?.message}
        // options={{
        //   required: true,
        // }}
        placeholder={'Descreva as atividade exercidas pela empresa'}
      />
    </>
  );
};

export default CadastroEmpresaDadosEmpresa;
