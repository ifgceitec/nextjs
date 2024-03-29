import { classNames } from '@/utils';
import { BiLinkExternal } from 'react-icons/bi';

type Props = {
  pdf: string;
  iframeProps?: any;
};

export default function PDFViewer({ pdf, iframeProps }: Props) {
  return (
    <>
      <iframe
        src={`${pdf.replace('http', 'https')}#toolbar=0&navpanes=0&scrollbar=0`}
        {...iframeProps}
        allowFullScreen={true}
        sandbox={true}
        // style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);"
      ></iframe>
    </>
  );
}
