import React from 'react';
import { TestingGuide, type TestingGuideProps } from './TestingGuide.tsx';

export const EnologyCalculators: React.FC<TestingGuideProps> = (props) => {
  return <TestingGuide initialActiveSubTab="calculators-sops" {...props} />;
};
