import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx'

export interface CustomerAvatar {
  businessName?: string
  industry?: string
  targetAudience?: string
  painPoints?: string
  goals?: string
  budget?: string
  location?: string
}

export interface MainOffer {
  productName?: string
  productDescription?: string
  price?: string
  valueProposition?: string
  features?: string
  guarantee?: string
}

export interface OrderBump {
  title?: string
  description?: string
  price?: string
  urgency?: string
}

export interface Upsells {
  upsell1?: {
    title?: string
    description?: string
    price?: string
  }
  upsell2?: {
    title?: string
    description?: string
    price?: string
  }
}

export interface OrderPage {
  headline?: string
  subheadline?: string
  callToAction?: string
  guarantee?: string
}

export interface ThankYouPage {
  headline?: string
  message?: string
  bonus?: string
}

export interface VSLScript {
  hook?: string
  problem?: string
  solution?: string
  proof?: string
  offer?: string
  close?: string
  urgency?: string
}

export interface EmailStrategy {
  welcome?: {
    subject?: string
    body?: string
  }
  nurture?: {
    subject?: string
    body?: string
  }
  offer?: {
    subject?: string
    body?: string
  }
}

export interface ExportContent {
  customerAvatar?: CustomerAvatar
  mainOffer?: MainOffer
  orderBump?: OrderBump
  upsells?: Upsells
  orderPage?: OrderPage
  thankYou?: ThankYouPage
  mainVSL?: VSLScript
  upsellVSL?: VSLScript
  emailStrategy?: EmailStrategy
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt'
  includeAll?: boolean
  businessName?: string
}

// PDF Export Functions
export const exportToPDF = async (content: ExportContent, options: ExportOptions) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPosition = 20

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, y: number, fontSize: number = 12) => {
    const maxWidth = pageWidth - (2 * margin)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.setFontSize(fontSize)
    doc.text(lines, margin, y)
    return y + (lines.length * fontSize * 0.4) + 5
  }

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    doc.setFont('helvetica', 'normal')
    return y + 10
  }

  // Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(`${options.businessName || 'Business'} - Complete Funnel Package`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 20

  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition)
  yPosition += 15

  // Customer Avatar Section
  if (content.customerAvatar) {
    yPosition = addSectionHeader('CUSTOMER AVATAR', yPosition)
    yPosition = addWrappedText(`Business Name: ${content.customerAvatar.businessName || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Industry: ${content.customerAvatar.industry || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Target Audience: ${content.customerAvatar.targetAudience || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Pain Points: ${content.customerAvatar.painPoints || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Goals: ${content.customerAvatar.goals || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Main Offer Section
  if (content.mainOffer) {
    yPosition = addSectionHeader('MAIN OFFER', yPosition)
    yPosition = addWrappedText(`Product Name: ${content.mainOffer.productName || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Description: ${content.mainOffer.productDescription || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Price: $${content.mainOffer.price || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Value Proposition: ${content.mainOffer.valueProposition || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Features: ${content.mainOffer.features || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Guarantee: ${content.mainOffer.guarantee || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Order Bump Section
  if (content.orderBump) {
    yPosition = addSectionHeader('ORDER BUMP', yPosition)
    yPosition = addWrappedText(`Title: ${content.orderBump.title || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Description: ${content.orderBump.description || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Price: $${content.orderBump.price || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Urgency: ${content.orderBump.urgency || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Upsells Section
  if (content.upsells) {
    yPosition = addSectionHeader('UPSELLS', yPosition)
    if (content.upsells.upsell1) {
      yPosition = addWrappedText(`Upsell 1: ${content.upsells.upsell1.title || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Description: ${content.upsells.upsell1.description || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Price: $${content.upsells.upsell1.price || 'N/A'}`, yPosition)
      yPosition += 5
    }
    if (content.upsells.upsell2) {
      yPosition = addWrappedText(`Upsell 2: ${content.upsells.upsell2.title || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Description: ${content.upsells.upsell2.description || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Price: $${content.upsells.upsell2.price || 'N/A'}`, yPosition)
      yPosition += 5
    }
    yPosition += 10
  }

  // Order Page Section
  if (content.orderPage) {
    yPosition = addSectionHeader('ORDER PAGE COPY', yPosition)
    yPosition = addWrappedText(`Headline: ${content.orderPage.headline || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Subheadline: ${content.orderPage.subheadline || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Call to Action: ${content.orderPage.callToAction || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Guarantee: ${content.orderPage.guarantee || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Thank You Page Section
  if (content.thankYou) {
    yPosition = addSectionHeader('THANK YOU PAGE', yPosition)
    yPosition = addWrappedText(`Headline: ${content.thankYou.headline || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Message: ${content.thankYou.message || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Bonus: ${content.thankYou.bonus || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Main VSL Section
  if (content.mainVSL) {
    yPosition = addSectionHeader('MAIN VSL SCRIPT', yPosition)
    yPosition = addWrappedText(`Hook: ${content.mainVSL.hook || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Problem: ${content.mainVSL.problem || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Solution: ${content.mainVSL.solution || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Proof: ${content.mainVSL.proof || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Offer: ${content.mainVSL.offer || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Close: ${content.mainVSL.close || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Urgency: ${content.mainVSL.urgency || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Upsell VSL Section
  if (content.upsellVSL) {
    yPosition = addSectionHeader('UPSELL VSL SCRIPT', yPosition)
    yPosition = addWrappedText(`Hook: ${content.upsellVSL.hook || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Problem: ${content.upsellVSL.problem || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Solution: ${content.upsellVSL.solution || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Proof: ${content.upsellVSL.proof || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Offer: ${content.upsellVSL.offer || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Close: ${content.upsellVSL.close || 'N/A'}`, yPosition)
    yPosition = addWrappedText(`Urgency: ${content.upsellVSL.urgency || 'N/A'}`, yPosition)
    yPosition += 10
  }

  // Email Strategy Section
  if (content.emailStrategy) {
    yPosition = addSectionHeader('EMAIL STRATEGY', yPosition)
    if (content.emailStrategy.welcome) {
      yPosition = addWrappedText(`Welcome Email Subject: ${content.emailStrategy.welcome.subject || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Body: ${content.emailStrategy.welcome.body || 'N/A'}`, yPosition)
      yPosition += 5
    }
    if (content.emailStrategy.nurture) {
      yPosition = addWrappedText(`Nurture Email Subject: ${content.emailStrategy.nurture.subject || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Body: ${content.emailStrategy.nurture.body || 'N/A'}`, yPosition)
      yPosition += 5
    }
    if (content.emailStrategy.offer) {
      yPosition = addWrappedText(`Offer Email Subject: ${content.emailStrategy.offer.subject || 'N/A'}`, yPosition)
      yPosition = addWrappedText(`Body: ${content.emailStrategy.offer.body || 'N/A'}`, yPosition)
      yPosition += 5
    }
    yPosition += 10
  }

  // Footer
  doc.setFontSize(10)
  doc.text('Generated by AI Funnel Builder', pageWidth / 2, yPosition, { align: 'center' })

  return doc
}

// Word Document Export Functions
export const exportToWord = async (content: ExportContent, options: ExportOptions) => {
  const children: Paragraph[] = []

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    return new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  }

  // Helper function to add subsection header
  const addSubsectionHeader = (title: string) => {
    return new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 }
    })
  }

  // Helper function to add text
  const addText = (text: string) => {
    return new Paragraph({
      text: text,
      spacing: { before: 100, after: 100 }
    })
  }

  // Helper function to add key-value pair
  const addKeyValue = (key: string, value: string) => {
    return new Paragraph({
      text: `${key}: ${value}`,
      spacing: { before: 50, after: 50 }
    })
  }

  // Title
  children.push(
    new Paragraph({
      text: `${options.businessName || 'Business'} - Complete Funnel Package`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 400 }
    })
  )

  // Date
  children.push(
    new Paragraph({
      text: `Generated on: ${new Date().toLocaleString()}`,
      spacing: { before: 200, after: 400 }
    })
  )

  // Customer Avatar Section
  if (content.customerAvatar) {
    children.push(addSectionHeader('CUSTOMER AVATAR'))
    children.push(addKeyValue('Business Name', content.customerAvatar.businessName || 'N/A'))
    children.push(addKeyValue('Industry', content.customerAvatar.industry || 'N/A'))
    children.push(addKeyValue('Target Audience', content.customerAvatar.targetAudience || 'N/A'))
    children.push(addKeyValue('Pain Points', content.customerAvatar.painPoints || 'N/A'))
    children.push(addKeyValue('Goals', content.customerAvatar.goals || 'N/A'))
  }

  // Main Offer Section
  if (content.mainOffer) {
    children.push(addSectionHeader('MAIN OFFER'))
    children.push(addKeyValue('Product Name', content.mainOffer.productName || 'N/A'))
    children.push(addKeyValue('Description', content.mainOffer.productDescription || 'N/A'))
    children.push(addKeyValue('Price', `$${content.mainOffer.price || 'N/A'}`))
    children.push(addKeyValue('Value Proposition', content.mainOffer.valueProposition || 'N/A'))
    children.push(addKeyValue('Features', content.mainOffer.features || 'N/A'))
    children.push(addKeyValue('Guarantee', content.mainOffer.guarantee || 'N/A'))
  }

  // Order Bump Section
  if (content.orderBump) {
    children.push(addSectionHeader('ORDER BUMP'))
    children.push(addKeyValue('Title', content.orderBump.title || 'N/A'))
    children.push(addKeyValue('Description', content.orderBump.description || 'N/A'))
    children.push(addKeyValue('Price', `$${content.orderBump.price || 'N/A'}`))
    children.push(addKeyValue('Urgency', content.orderBump.urgency || 'N/A'))
  }

  // Upsells Section
  if (content.upsells) {
    children.push(addSectionHeader('UPSELLS'))
    if (content.upsells.upsell1) {
      children.push(addSubsectionHeader('Upsell 1'))
      children.push(addKeyValue('Title', content.upsells.upsell1.title || 'N/A'))
      children.push(addKeyValue('Description', content.upsells.upsell1.description || 'N/A'))
      children.push(addKeyValue('Price', `$${content.upsells.upsell1.price || 'N/A'}`))
    }
    if (content.upsells.upsell2) {
      children.push(addSubsectionHeader('Upsell 2'))
      children.push(addKeyValue('Title', content.upsells.upsell2.title || 'N/A'))
      children.push(addKeyValue('Description', content.upsells.upsell2.description || 'N/A'))
      children.push(addKeyValue('Price', `$${content.upsells.upsell2.price || 'N/A'}`))
    }
  }

  // Order Page Section
  if (content.orderPage) {
    children.push(addSectionHeader('ORDER PAGE COPY'))
    children.push(addKeyValue('Headline', content.orderPage.headline || 'N/A'))
    children.push(addKeyValue('Subheadline', content.orderPage.subheadline || 'N/A'))
    children.push(addKeyValue('Call to Action', content.orderPage.callToAction || 'N/A'))
    children.push(addKeyValue('Guarantee', content.orderPage.guarantee || 'N/A'))
  }

  // Thank You Page Section
  if (content.thankYou) {
    children.push(addSectionHeader('THANK YOU PAGE'))
    children.push(addKeyValue('Headline', content.thankYou.headline || 'N/A'))
    children.push(addKeyValue('Message', content.thankYou.message || 'N/A'))
    children.push(addKeyValue('Bonus', content.thankYou.bonus || 'N/A'))
  }

  // Main VSL Section
  if (content.mainVSL) {
    children.push(addSectionHeader('MAIN VSL SCRIPT'))
    children.push(addKeyValue('Hook', content.mainVSL.hook || 'N/A'))
    children.push(addKeyValue('Problem', content.mainVSL.problem || 'N/A'))
    children.push(addKeyValue('Solution', content.mainVSL.solution || 'N/A'))
    children.push(addKeyValue('Proof', content.mainVSL.proof || 'N/A'))
    children.push(addKeyValue('Offer', content.mainVSL.offer || 'N/A'))
    children.push(addKeyValue('Close', content.mainVSL.close || 'N/A'))
    children.push(addKeyValue('Urgency', content.mainVSL.urgency || 'N/A'))
  }

  // Upsell VSL Section
  if (content.upsellVSL) {
    children.push(addSectionHeader('UPSELL VSL SCRIPT'))
    children.push(addKeyValue('Hook', content.upsellVSL.hook || 'N/A'))
    children.push(addKeyValue('Problem', content.upsellVSL.problem || 'N/A'))
    children.push(addKeyValue('Solution', content.upsellVSL.solution || 'N/A'))
    children.push(addKeyValue('Proof', content.upsellVSL.proof || 'N/A'))
    children.push(addKeyValue('Offer', content.upsellVSL.offer || 'N/A'))
    children.push(addKeyValue('Close', content.upsellVSL.close || 'N/A'))
    children.push(addKeyValue('Urgency', content.upsellVSL.urgency || 'N/A'))
  }

  // Email Strategy Section
  if (content.emailStrategy) {
    children.push(addSectionHeader('EMAIL STRATEGY'))
    if (content.emailStrategy.welcome) {
      children.push(addSubsectionHeader('Welcome Email'))
      children.push(addKeyValue('Subject', content.emailStrategy.welcome.subject || 'N/A'))
      children.push(addText(content.emailStrategy.welcome.body || 'N/A'))
    }
    if (content.emailStrategy.nurture) {
      children.push(addSubsectionHeader('Nurture Email'))
      children.push(addKeyValue('Subject', content.emailStrategy.nurture.subject || 'N/A'))
      children.push(addText(content.emailStrategy.nurture.body || 'N/A'))
    }
    if (content.emailStrategy.offer) {
      children.push(addSubsectionHeader('Offer Email'))
      children.push(addKeyValue('Subject', content.emailStrategy.offer.subject || 'N/A'))
      children.push(addText(content.emailStrategy.offer.body || 'N/A'))
    }
  }

  // Footer
  children.push(
    new Paragraph({
      text: 'Generated by AI Funnel Builder',
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 }
    })
  )

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  })

  return await Packer.toBlob(doc)
}

// Complete Funnel Package Export
export const exportCompleteFunnel = async (content: ExportContent, options: ExportOptions) => {
  switch (options.format) {
    case 'pdf':
      const pdfDoc = await exportToPDF(content, options)
      return await pdfDoc.output('blob')
    case 'docx':
      return await exportToWord(content, options)
    case 'txt':
      return exportToText(content, options)
    default:
      throw new Error('Unsupported format')
  }
}

// Text Export (existing functionality)
export const exportToText = (content: ExportContent, options: ExportOptions) => {
  let text = `${options.businessName || 'Business'} - Complete Funnel Package\n${'='.repeat(50)}\n\n`
  text += `Generated on: ${new Date().toLocaleString()}\n\n`

  if (content.customerAvatar) {
    text += `CUSTOMER AVATAR\n${'-'.repeat(30)}\n`
    text += `Business Name: ${content.customerAvatar.businessName || 'N/A'}\n`
    text += `Industry: ${content.customerAvatar.industry || 'N/A'}\n`
    text += `Target Audience: ${content.customerAvatar.targetAudience || 'N/A'}\n`
    text += `Pain Points: ${content.customerAvatar.painPoints || 'N/A'}\n`
    text += `Goals: ${content.customerAvatar.goals || 'N/A'}\n\n`
  }

  if (content.mainOffer) {
    text += `MAIN OFFER\n${'-'.repeat(30)}\n`
    text += `Product Name: ${content.mainOffer.productName || 'N/A'}\n`
    text += `Description: ${content.mainOffer.productDescription || 'N/A'}\n`
    text += `Price: $${content.mainOffer.price || 'N/A'}\n`
    text += `Value Proposition: ${content.mainOffer.valueProposition || 'N/A'}\n`
    text += `Features: ${content.mainOffer.features || 'N/A'}\n`
    text += `Guarantee: ${content.mainOffer.guarantee || 'N/A'}\n\n`
  }

  if (content.orderBump) {
    text += `ORDER BUMP\n${'-'.repeat(30)}\n`
    text += `Title: ${content.orderBump.title || 'N/A'}\n`
    text += `Description: ${content.orderBump.description || 'N/A'}\n`
    text += `Price: $${content.orderBump.price || 'N/A'}\n`
    text += `Urgency: ${content.orderBump.urgency || 'N/A'}\n\n`
  }

  if (content.upsells) {
    text += `UPSELLS\n${'-'.repeat(30)}\n`
    if (content.upsells.upsell1) {
      text += `Upsell 1:\n`
      text += `Title: ${content.upsells.upsell1.title || 'N/A'}\n`
      text += `Description: ${content.upsells.upsell1.description || 'N/A'}\n`
      text += `Price: $${content.upsells.upsell1.price || 'N/A'}\n\n`
    }
    if (content.upsells.upsell2) {
      text += `Upsell 2:\n`
      text += `Title: ${content.upsells.upsell2.title || 'N/A'}\n`
      text += `Description: ${content.upsells.upsell2.description || 'N/A'}\n`
      text += `Price: $${content.upsells.upsell2.price || 'N/A'}\n\n`
    }
  }

  if (content.orderPage) {
    text += `ORDER PAGE COPY\n${'-'.repeat(30)}\n`
    text += `Headline: ${content.orderPage.headline || 'N/A'}\n`
    text += `Subheadline: ${content.orderPage.subheadline || 'N/A'}\n`
    text += `Call to Action: ${content.orderPage.callToAction || 'N/A'}\n`
    text += `Guarantee: ${content.orderPage.guarantee || 'N/A'}\n\n`
  }

  if (content.thankYou) {
    text += `THANK YOU PAGE\n${'-'.repeat(30)}\n`
    text += `Headline: ${content.thankYou.headline || 'N/A'}\n`
    text += `Message: ${content.thankYou.message || 'N/A'}\n`
    text += `Bonus: ${content.thankYou.bonus || 'N/A'}\n\n`
  }

  if (content.mainVSL) {
    text += `MAIN VSL SCRIPT\n${'-'.repeat(30)}\n`
    text += `Hook: ${content.mainVSL.hook || 'N/A'}\n`
    text += `Problem: ${content.mainVSL.problem || 'N/A'}\n`
    text += `Solution: ${content.mainVSL.solution || 'N/A'}\n`
    text += `Proof: ${content.mainVSL.proof || 'N/A'}\n`
    text += `Offer: ${content.mainVSL.offer || 'N/A'}\n`
    text += `Close: ${content.mainVSL.close || 'N/A'}\n`
    text += `Urgency: ${content.mainVSL.urgency || 'N/A'}\n\n`
  }

  if (content.upsellVSL) {
    text += `UPSELL VSL SCRIPT\n${'-'.repeat(30)}\n`
    text += `Hook: ${content.upsellVSL.hook || 'N/A'}\n`
    text += `Problem: ${content.upsellVSL.problem || 'N/A'}\n`
    text += `Solution: ${content.upsellVSL.solution || 'N/A'}\n`
    text += `Proof: ${content.upsellVSL.proof || 'N/A'}\n`
    text += `Offer: ${content.upsellVSL.offer || 'N/A'}\n`
    text += `Close: ${content.upsellVSL.close || 'N/A'}\n`
    text += `Urgency: ${content.upsellVSL.urgency || 'N/A'}\n\n`
  }

  if (content.emailStrategy) {
    text += `EMAIL STRATEGY\n${'-'.repeat(30)}\n`
    if (content.emailStrategy.welcome) {
      text += `Welcome Email:\n`
      text += `Subject: ${content.emailStrategy.welcome.subject || 'N/A'}\n`
      text += `Body: ${content.emailStrategy.welcome.body || 'N/A'}\n\n`
    }
    if (content.emailStrategy.nurture) {
      text += `Nurture Email:\n`
      text += `Subject: ${content.emailStrategy.nurture.subject || 'N/A'}\n`
      text += `Body: ${content.emailStrategy.nurture.body || 'N/A'}\n\n`
    }
    if (content.emailStrategy.offer) {
      text += `Offer Email:\n`
      text += `Subject: ${content.emailStrategy.offer.subject || 'N/A'}\n`
      text += `Body: ${content.emailStrategy.offer.body || 'N/A'}\n\n`
    }
  }

  text += `Generated by AI Funnel Builder`
  return text
}

// Helper function to trigger download
export const downloadFile = (blob: Blob | string, filename: string, mimeType?: string) => {
  if (typeof blob === 'string') {
    // Text file
    const blobObj = new Blob([blob], { type: mimeType || 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blobObj)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } else {
    // Blob (PDF, Word)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
