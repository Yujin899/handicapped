import React from 'react';
import { getDictionary } from '../../i18n/dictionaries';
import { Locale } from '../../i18n/config';
import { HomeClient } from '../../components/home-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <HomeClient dict={dict} locale={locale} />;
}
