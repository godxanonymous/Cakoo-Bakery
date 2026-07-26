import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Product } from '@/lib/mockData';

export const revalidate = 0; // Disable cache for now to ensure fresh data

export async function GET() {
  try {
    if (!adminDb) {
      throw new Error("Firebase Admin not initialized. Check .env.local credentials.");
    }

    const snapshot = await adminDb.collection('products').get();
    const products: Product[] = [];
    const categoriesSet = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data() as Product;
      // Ensure the id matches the document id
      data.id = doc.id;
      products.push(data);
      if (data.category) {
        categoriesSet.add(data.category);
      }
    });

    const categories = Array.from(categoriesSet);

    return NextResponse.json({ 
      products, 
      categories,
      source: 'firebase' 
    });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return NextResponse.json({ 
      products: [], 
      categories: [],
      source: 'error', 
      error: String(error) 
    }, { status: 500 });
  }
}
