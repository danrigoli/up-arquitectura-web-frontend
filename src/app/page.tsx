"use client";

import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  const words = [
    {
      text: "Trabajo",
    },
    {
      text: "Practico",
    },
    {
      text: "Integrador",
    },
    {
      text: "Arquitectura Web.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] max-w-8xl mx-auto">
    <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        Desarrollado por Dante Rigoli - Q2 2024
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="/login" passHref>
          <Button variant="default" size="lg" type='button'>
            Ingresar
          </Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="outline" size="lg" type='button'>
            Registrarse
          </Button>
        </Link>
      </div>
    </div>
  );
}
