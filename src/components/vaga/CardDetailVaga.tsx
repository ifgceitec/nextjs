import { IVaga } from '@/interfaces/vaga';
import Link from 'next/link';
import { BiGlasses, BiGroup, BiHome, BiTime } from 'react-icons/bi';
import { BadgeGroup } from '@/components/atoms/Badge';
import {
  JornadaTrabalhoChoices,
  ModeloTrabalhoChoices,
  RegimeContratualChoices,
} from '@/utils/choices';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import useModal from '@/hooks/useModal';
import ConfirmModal from '@/components/atoms/ConfirmModal';
import TextSkeleton from '@/components/skeleton/TextSkeleton';
import { useAuthStore } from '@/store/auth';
import { classNames } from '@/utils';
import Router from 'next/router';
import { toastWarning } from '@/utils/toasts';
import { formatDateToLocale } from '@/utils/date';
import { currencyMask } from '@/utils/masks';
import { range } from 'lodash';
import useBreakpoint from '@/hooks/useBreakpoint';

type Props = {
  vaga: IVaga;
  isFeature?: boolean;
  isOwner?: boolean;
  selected?: boolean;
  onAction?: () => void;
  onClick?: () => void;
  onDelete?: (id: number) => void;
  onExpanded?: () => void;
  className?: string;
  skeleton?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  canCandidate?: boolean;
};

const CardDetailVaga = ({
  vaga,
  selected,
  onClick,
  onDelete,
  onAction,
  onExpanded,
  isOwner,
  isFeature,
  className,
  isExpandable,
  isExpanded,
  skeleton = null,
  canCandidate = false,
}: Props) => {
  const topRef = useRef<HTMLDivElement>(null);
  const [itemId, setItemId] = useState<number>(null);
  const { open, toggle } = useModal();
  const candidaturas = useAuthStore((state) => state.candidaturas);
  const [isGuest, isCandidato] = useAuthStore((state) => [
    state.isGuest,
    state.isCandidato,
  ]);
  const [expanded, setExpanded] = useState<boolean>(isExpanded);
  const [isCandidatado, setIsCandidatado] = useState<boolean>(false);
  const { isBreakpoint } = useBreakpoint();

  useEffect(() => {
    setIsCandidatado(candidaturas.some((i) => i.vaga == vaga.id));
  }, [candidaturas, vaga]);

  const badges = [
    {
      kind: 'base',
      icon: <BiGlasses />,
      label: RegimeContratualChoices.findByIntValue(vaga?.regime_contratual)
        ?.label,
    },
    {
      kind: 'base',
      icon: <BiHome />,
      label: ModeloTrabalhoChoices.findByIntValue(vaga?.modelo_trabalho)?.label,
    },
    {
      kind: 'base',
      icon: <BiTime />,
      label: JornadaTrabalhoChoices.findByIntValue(vaga?.jornada_trabalho)
        ?.label,
    },
    {
      kind: 'base',
      icon: <BiGroup />,
      label: vaga?.quantidade_vagas + ' vagas',
    },
  ];

  const handleGuestCandidate = () => {
    toastWarning('Voc?? precisa estar logado para se candidatar');
    return Router.push('/login');
  };

  const handleAction = () => {
    if (isExpandable && isBreakpoint('lg')) {
      setExpanded(!expanded);
      onExpanded && onExpanded();
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      onAction && onAction();
    }
  };

  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  // useEffect(() => {
  //   setExpanded(false);
  //
  // }, [breakpoint]);

  const renderItem = (vaga: IVaga, index?: number, ref?) => {
    return (
      <div
        ref={ref}
        key={index}
        className={classNames(
          'card rounded w-full bg-white',
          (onAction || isFeature) && 'cursor-pointer',
          selected ? 'lg:bg-gray-100' : 'bg-white',
          className,
        )}
        onClick={handleAction}
      >
        <div className="card-body p-4">
          <div className="flex">
            <div>
              <h2 className="card-title font-noto-sans">
                <TextSkeleton className="h-6 w-48 bg-base-100">
                  {vaga?.cargo}
                </TextSkeleton>
              </h2>
              <p className="card-subtitle text-gray-500">
                <TextSkeleton as="span">
                  {vaga?.salario && currencyMask.mask(vaga?.salario)}
                </TextSkeleton>
              </p>
              <p className="text-sm text-fade">
                <TextSkeleton as="span">
                  {vaga?.created_at && formatDateToLocale(vaga?.created_at)}
                </TextSkeleton>
              </p>
            </div>
            {isOwner && !isFeature && (
              <div className="ml-auto flex flex-col gap-2">
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={`/empresa/vaga/${vaga?.id}/editar`}
                  className="link link-hover link-neutral text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemId(vaga.id);
                    toggle();
                  }}
                  className={'link link-hover link-error text-sm '}
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
          <div className="lg:flex flex-wrap items-center justify-between space-y-4 lg:space-y-0 gap-4">
            <BadgeGroup badges={badges} />

            {(isGuest() || isCandidato()) &&
              canCandidate &&
              !isFeature &&
              !skeleton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isGuest() ? handleGuestCandidate() : onClick();
                  }}
                  className={classNames(
                    'btn btn-sm',
                    isCandidatado && 'btn-error',
                  )}
                >
                  {isCandidatado ? 'Cancelar candidatura' : 'Candidatar-se'}
                </button>
              )}
          </div>

          {skeleton || (isExpandable && !expanded) || isFeature ? (
            <p className="whitespace-pre-line truncate-4">
              <TextSkeleton
                as="span"
                className="h-4 w-full bg-base-100"
                rows={4}
              >
                {vaga?.atividades}
              </TextSkeleton>
            </p>
          ) : (
            <>
              {vaga?.atividades && (
                <div>
                  <p className="text-fade">Atividades envolvidas na cargo</p>
                  <p className="whitespace-pre-line">{vaga?.atividades}</p>
                </div>
              )}
              {vaga?.requisitos && (
                <div>
                  <h2 className="text-fade">
                    Requisitos necess??rios ou desej??veis
                  </h2>
                  <p className="whitespace-pre-line">{vaga?.requisitos}</p>
                </div>
              )}

              {!!vaga?.beneficios.length && (
                <div>
                  <h2 className="text-fade">Benef??cios</h2>
                  <ul className="list list-disc list-inside">
                    {vaga?.beneficios?.map((beneficio) => (
                      <li key={beneficio.id}>{beneficio.nome}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="divider"></div>
            </>
          )}

          {/*<div>*/}
          {/*  <h2 className="text-fade">Candidatos</h2>*/}
          {/*  <ul className="list list-disc list-inside">*/}
          {/*    {vaga?.beneficios?.map((beneficio) => (*/}
          {/*      <li key={beneficio.id}>{beneficio.nome}</li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}
          <div className="card-actions items-center mt-auto">
            {!isOwner && (
              <Link
                href={`/empresa/${vaga?.empresa?.id}`}
                className="flex items-center gap-2 rounded hover:bg-base-200 transition duration-150 p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="avatar">
                  <div className="w-10 rounded-full relative">
                    <Image
                      src="https://placeimg.com/400/225/arch"
                      fill
                      alt="Logo da empresa"
                    />
                  </div>
                </div>
                <p>
                  <TextSkeleton
                    as="span"
                    className="h-4 w-16
                   bg-base-100"
                  >
                    {vaga?.empresa?.nome_fantasia}
                  </TextSkeleton>
                </p>
              </Link>
            )}
            {canCandidate && isFeature && !isOwner && isCandidato() && (
              <button
                className={classNames(
                  'mx-auto lg:ml-auto btn btn-sm btn-wide',
                  isCandidatado && 'btn-error',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  isGuest() ? handleGuestCandidate() : onClick();
                }}
              >
                {isCandidatado ? 'Cancelar candidatura' : 'Candidatar-se'}
              </button>
            )}
            {isOwner && (
              <Link
                href={`/empresa/vaga/${vaga?.id}`}
                className="link link-hover link-neutral text-sm ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                Ver candidatos
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {skeleton
        ? range(skeleton).map((i) => renderItem(null, i))
        : renderItem(vaga, null, topRef)}
      {isOwner && (
        <ConfirmModal
          open={open}
          close={toggle}
          confirm={() => onDelete(itemId)}
          title={'Excluir vaga'}
          message={'Deseja realmente excluir esta vaga?'}
        />
      )}
    </>
  );
};

export default CardDetailVaga;
