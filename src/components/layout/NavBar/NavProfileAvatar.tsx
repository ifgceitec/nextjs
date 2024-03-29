import Image from 'next/image';
import { ICandidato } from '@/interfaces/candidato';
import { IEmpregador } from '@/interfaces/empregador';

type Props = { user: ICandidato | IEmpregador };

const NavProfileAvatar = ({ user }: Props) => {
  return (
    <>
      <div className="inline-flex gap-2 items-center hover:bg-base-200 p-3 rounded">
        <div className="text-right">
          <p className="text-neutral w-32 truncate">{user?.nome}</p>
          {/*<p className="text-sm">Empregador</p>*/}
        </div>
        <div className="avatar">
          <div className="w-10 rounded-full relative">
            <Image
              src={user?.foto ?? '/img/person-placeholder.jpg'}
              fill
              alt="Retrato do Usuário"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavProfileAvatar;
