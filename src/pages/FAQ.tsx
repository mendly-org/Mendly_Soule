import Navbar from "@/components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book a repair service?",
      answer: "Simply search for the service you need, browse available shops, select your preferred provider, and click 'Book Service'. You'll be able to choose your preferred date and time, and provide details about your repair needs."
    },
    {
      question: "Are all service providers verified?",
      answer: "Yes, all service providers on our platform go through a verification process. We check their credentials, licenses, and customer reviews to ensure they meet our quality standards."
    },
    {
      question: "What if I need to cancel my booking?",
      answer: "You can cancel your booking from your profile page. Please note that cancellation policies vary by shop. Some shops may charge a cancellation fee if you cancel within their specified time window."
    },
    {
      question: "How do I pay for services?",
      answer: "Payment details and methods vary by service provider. Most shops accept cash, credit/debit cards, and digital payment methods. The exact payment options will be displayed when you book a service."
    },
    {
      question: "What types of repairs do you offer?",
      answer: "We offer a wide range of repair services including electronics (phones, laptops, tablets), home appliances (washing machines, refrigerators, AC units), and more. Browse our categories to see all available services."
    },
    {
      question: "Can I get on-site service at my location?",
      answer: "Many of our service providers offer on-site repairs. When browsing services, look for the 'On-site Available' badge. You can also filter search results to show only shops that offer on-site service."
    },
    {
      question: "How do I leave a review?",
      answer: "After your service is completed, you can leave a review from your bookings page. Your feedback helps other customers make informed decisions and helps us maintain quality standards."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "Customer satisfaction is our priority. If you're not satisfied with a service, please contact us immediately through our support channels. We'll work with you and the service provider to resolve any issues."
    },
    {
      question: "How do I track my booking status?",
      answer: "You can track all your bookings from your profile page. You'll see the current status of each booking (Pending, Confirmed, In Progress, or Completed) and receive notifications about any updates."
    },
    {
      question: "Do shops offer warranties on repairs?",
      answer: "Warranty policies vary by shop and service type. Check the service details page for warranty information, or contact the shop directly before booking."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h1>
          <p className="text-center text-muted-foreground mb-12">
            Find answers to common questions about our platform
          </p>

          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a 
              href="/contact" 
              className="text-primary hover:underline font-medium"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
