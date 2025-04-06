"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Share2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, you would send the form data to your API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Message sent!",
          description: "We'll get back to you shortly.",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Refer a Friend",
          text: "Know someone looking for a new vehicle? Refer them to us and earn R3,000 cash!",
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the share feature. Copy the link and share it manually.",
      })
    }
  }

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">We're here to help you find the perfect vehicle and financing solution.</p>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p>
                        <a href="tel:+27745185189" className="hover:text-primary">
                          +27 074 518 5189
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p>
                        <a href="mailto:thembahectormkhwanazi@gmail.com" className="hover:text-primary">
                        thembahectormkhwanazi@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p>123 Car Street, Auto City</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p>
                        Monday - Friday: 8am - 5pm
                        <br />
                        Saturday: 9am - 3pm
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted h-64 rounded-md flex items-center justify-center mb-2">
                    <p className="text-muted-foreground">Google Map</p>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">123 Car Street, Auto City</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-bold text-green-600 mb-2">Thank You!</h3>
                      <p className="mb-6">Your message has been sent successfully. We'll get back to you shortly.</p>
                      <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select value={formData.subject} onValueChange={handleSelectChange}>
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="finance">Finance Application</SelectItem>
                              <SelectItem value="vehicle">Vehicle Inquiry</SelectItem>
                              <SelectItem value="test-drive">Schedule Test Drive</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mb-12">
  <Card>
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-muted h-64 md:h-auto">
        <div className="h-full w-full flex items-center justify-center">
          <img
            src="/Afiiis.jpg"
            alt="Referral"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Refer a Friend</h3>
        <p className="mb-2">Know someone who's looking for a new vehicle? Refer them to us and earn rewards!</p>
        <p className="mb-6">
          For every successful referral that leads to a vehicle purchase, you'll receive R3,000 cash.
        </p>
        <Button onClick={shareReferral}>
          <Share2 className="mr-2 h-4 w-4" />
          Share with a Friend
        </Button>
      </div>
    </div>
  </Card>
</section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                How can I schedule a test drive?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                You can schedule a test drive by filling out our contact form, calling us directly, or visiting our
                showroom during business hours. We recommend booking in advance to ensure the vehicle is available.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                Do you deliver vehicles nationwide?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Yes, we offer nationwide delivery for all our vehicles. Delivery fees may apply depending on your
                location. Contact us for a delivery quote to your area.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                Can I trade in my current vehicle?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                We accept trade-ins and will provide you with a competitive valuation. Bring your vehicle to our
                showroom for an assessment or send us details and photos for a preliminary estimate.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Footer />
    </>
  )
}

