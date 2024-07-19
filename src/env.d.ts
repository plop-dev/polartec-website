/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      displayName: string;
      email: string;
      password: string;
      uniqueName: string;
      dateCreated: Date;
      _id: string;
      redirect?: boolean;
    };
  }
}
