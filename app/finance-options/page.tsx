"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FinanceOptionsPage() {
  const [vehiclePrice, setVehiclePrice] = useState(250000)
  const [downPayment, setDownPayment] = useState(50000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [loanTerm, setLoanTerm] = useState(60)
  const [balloonPayment, setBalloonPayment] = useState(0)

  // Calculate loan details
  const balloonAmount = vehiclePrice * (balloonPayment / 100)
  const loanAmount = vehiclePrice - downPayment
  const monthlyInterestRate = interestRate / 100 / 12

  let monthlyPayment
  if (balloonPayment > 0) {
    // Formula for loan with balloon payment
    monthlyPayment =
      ((loanAmount - balloonAmount) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
  } else {
    // Standard loan formula
    monthlyPayment =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
  }

  const totalPayments = monthlyPayment * loanTerm
  const totalInterest = totalPayments - (loanAmount - balloonAmount)
  const totalCost = totalPayments + downPayment + balloonAmount

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Finance Options</h1>
          <p className="text-lg">Explore our flexible financing solutions to find the perfect plan for your budget.</p>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-transparent hover:border-primary hover:-translate-y-1 transition-all">
              <CardHeader className="bg-gray-50">
                <h3 className="text-xl font-bold">Standard Finance</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Competitive interest rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Terms from 36 to 72 months</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Flexible down payment options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Quick approval process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>No early settlement penalties</span>
                  </li>
                </ul>
                <p className="font-semibold text-lg mt-4">From 9.5% interest rate</p>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary relative hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold py-1 px-2">
                Most Popular
              </div>
              <CardHeader className="bg-gray-50">
                <h3 className="text-xl font-bold">Premium Finance</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Reduced interest rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Extended warranty included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Free service plan for 3 years</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Roadside assistance package</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Flexible payment options</span>
                  </li>
                </ul>
                <p className="font-semibold text-lg mt-4">From 8.5% interest rate</p>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary hover:-translate-y-1 transition-all">
              <CardHeader className="bg-gray-50">
                <h3 className="text-xl font-bold">Balloon Payment</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Lower monthly payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Flexible balloon percentage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Option to refinance balloon</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Ideal for luxury vehicles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Trade-in options at end of term</span>
                  </li>
                </ul>
                <p className="font-semibold text-lg mt-4">From 10% interest rate</p>
              </CardContent>
              <CardFooter>
                <Link href="/contact" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Finance Calculator</h2>
          <p className="mb-6">Estimate your monthly payments with our easy-to-use calculator.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-price">Vehicle Price (R)</Label>
                <Input
                  id="vehicle-price"
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="down-payment">Down Payment (R)</Label>
                <Input
                  id="down-payment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">Loan Term</Label>
                <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                  <SelectTrigger id="loan-term">
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="36">36 months (3 years)</SelectItem>
                    <SelectItem value="48">48 months (4 years)</SelectItem>
                    <SelectItem value="60">60 months (5 years)</SelectItem>
                    <SelectItem value="72">72 months (6 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balloon-payment">Balloon Payment (%)</Label>
                <Input
                  id="balloon-payment"
                  type="number"
                  min="0"
                  max="40"
                  value={balloonPayment}
                  onChange={(e) => setBalloonPayment(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 pb-2 border-b">Payment Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>Loan Amount:</span>
                  <span className="font-semibold">R{loanAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span>Monthly Payment:</span>
                  <span className="font-semibold">R{monthlyPayment.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span>Total Interest:</span>
                  <span className="font-semibold">R{totalInterest.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span>Total Cost:</span>
                  <span className="font-semibold">R{totalCost.toFixed(2)}</span>
                </div>

                {balloonPayment > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span>Balloon Payment Due:</span>
                    <span className="font-semibold">R{balloonAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-500">This is an estimate. Contact us for a personalized quote.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                What documents do I need to apply for finance?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                To apply for vehicle finance, you'll need your ID document, driver's license, proof of residence (not
                older than 3 months), latest 3 months' bank statements, and proof of income (latest 3 payslips).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                How long does the approval process take?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Our approval process typically takes 24-48 hours once all required documents have been submitted. In
                some cases, we can provide same-day approval.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                Can I apply if I have a bad credit score?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                Yes, we work with various financial institutions that cater to different credit profiles. While a good
                credit score helps secure better rates, we have options for clients with less-than-perfect credit
                histories.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">What is a balloon payment?</AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                A balloon payment is a lump sum payment due at the end of your loan term. It allows for lower monthly
                payments throughout the loan period, but requires you to pay a larger amount at the end. This option is
                popular for those who plan to trade in or sell the vehicle before the loan term ends.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Footer />
    </>
  )
}

