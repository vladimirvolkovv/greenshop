import React from 'react';
import { Helmet } from 'react-helmet';
const Meta = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'GREENBOX Shop - лучшие товары!',
  description: 'Лучшие товары для клиентов склада индивидуального хранения GREENBOX!',
};

export default Meta;
