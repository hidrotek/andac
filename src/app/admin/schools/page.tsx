'use client';

import { useState, useEffect } from 'react';
import { AddSchoolDialog } from "@/components/admin/add-school-dialog";
import { SchoolList } from "@/components/admin/school-list";
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, collectionGroup, where, getCountFromServer } from "firebase/firestore";
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { School, User } from '@/lib/types';


export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const firestore = useFirestore();
  const { toast } = useToast();

 useEffect(() => {
    if (!firestore) return;

    const schoolsCol = collection(firestore, 'schools');
    const q = query(schoolsCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const schoolsData: School[] = [];
      for (const doc of querySnapshot.docs) {
        const school = { id: doc.id, ...doc.data() } as School;

        // Her okul için öğrenci sayısını hesapla
        try {
          const usersRef = collection(firestore, 'users');
          const studentQuery = query(usersRef, where('schoolId', '==', school.id), where('role', '==', 'student'));
          const studentSnapshot = await getCountFromServer(studentQuery);
          school.studentCount = studentSnapshot.data().count;
        } catch (error) {
          console.error(`Error getting student count for school ${school.id}:`, error);
          school.studentCount = 0;
        }

        schoolsData.push(school);
      }
      setSchools(schoolsData);
    });

    return () => unsubscribe();
  }, [firestore]);


  const handleAddSchool = async (newSchoolData: Omit<School, 'id' | 'createdAt' | 'studentCount'>) => {
    if (!firestore) return;

    try {
        await addDoc(collection(firestore, 'schools'), {
            ...newSchoolData,
            createdAt: new Date().toISOString(),
        });
        toast({
            title: 'Okul Eklendi',
            description: `${newSchoolData.name} başarıyla sisteme eklendi.`
        });
    } catch (error) {
        console.error("Error adding school: ", error);
        toast({
            variant: 'destructive',
            title: 'Hata!',
            description: 'Okul eklenirken bir sorun oluştu.'
        });
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
                 <h1 className="text-2xl md:text-3xl font-bold font-headline">Okul Yönetimi</h1>
                 <p className="text-muted-foreground mt-1">Sisteme kayıtlı okulları yönetin ve yeni okul ekleyin.</p>
            </div>
            <AddSchoolDialog onAddSchool={handleAddSchool} />
       </div>
      
      <SchoolList schools={schools} />
    </div>
  );
}
