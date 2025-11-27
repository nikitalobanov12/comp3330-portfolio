import ContactForm from "@/src/components/contact-form";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-roboto-mono)] mb-4">
          Contact Me
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have a question or want to work together? Fill out the form below and
          I&apos;ll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
