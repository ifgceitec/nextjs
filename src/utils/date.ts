import * as dateFns from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDateToExtense(date: string) {
  if (!date) return '';

  const parsedDate = new Date(Date.parse(date));
  const dateFormat = 'LLLL, yyyy';
  return dateFns.format(parsedDate, dateFormat, { locale: ptBR });
}

export function formatDateToLocale(date: string) {
  const parsedDate = new Date(Date.parse(date));
  const dateFormat = 'dd/MM/yyyy';
  return dateFns.format(parsedDate, dateFormat, { locale: ptBR });
}

export function formatDateToAPI(date: string) {
  const parsedDate = new Date(Date.parse(date));
  const dateFormat = 'yyyy-MM-dd';
  return dateFns.format(parsedDate, dateFormat, { locale: ptBR });
}
