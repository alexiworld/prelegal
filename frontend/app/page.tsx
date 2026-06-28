import type { Metadata } from 'next';
import { NdaCreator } from '@/components/NdaCreator';

export const metadata: Metadata = {
  title: 'Mutual NDA Creator',
  description: 'Generate a Mutual Non-Disclosure Agreement using CommonPaper standard terms.',
};

export default function Home() {
  return <NdaCreator />;
}
