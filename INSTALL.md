# Proje Kurulum Rehberi

Bu rehber, projenin hem lokal geliştirme ortamında nasıl çalıştırılacağını hem de cPanel gibi Node.js destekleyen bir hosting ortamına nasıl kurulacağını adım adım açıklar.

---

## Lokal Geliştirme Ortamı Kurulumu (Kendi Bilgisayarınızda)

Projeyi kendi bilgisayarınızda geliştirmek ve çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
1.  **Node.js:** Bilgisayarınızda Node.js'in 20.x sürümünün kurulu olması gereklidir. [Node.js resmi sitesinden](https://nodejs.org/en) indirebilirsiniz.
2.  **npm (Node Paket Yöneticisi):** Node.js ile birlikte otomatik olarak gelir.

### Adımlar

1.  **Proje Dosyalarını İndirin:**
    Projenin tüm dosyalarını ve klasörlerini bilgisayarınızdaki bir dizine indirin.

2.  **Bağımlılıkları Yükleyin:**
    Terminali (veya Komut İstemi'ni) açın ve proje klasörünün içine gidin. Ardından aşağıdaki komutu çalıştırın. Bu komut, projenin ihtiyaç duyduğu tüm kütüphaneleri (`node_modules` klasörüne) indirecektir.
    ```bash
    npm install
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    Kurulum tamamlandıktan sonra, aşağıdaki komutla geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```

4.  **Projeyi Görüntüleyin:**
    Sunucu başarıyla başladığında, terminalde size bir adres verilecektir (genellikle `http://localhost:3000`). Bu adresi tarayıcınızda açarak projeyi canlı olarak görebilir ve kod üzerinde yaptığınız değişikliklerin anında yansımasını izleyebilirsiniz.

---

## Sunucu (cPanel) Kurulumu

Bu bölüm, projenin cPanel gibi Node.js destekleyen bir hosting ortamına nasıl kurulacağını açıklar.

### Adım 1: Dosyaları Sunucuya Yükleme

1.  Projenin tüm dosyalarını bir ZIP arşivi haline getirin (`node_modules` klasörü hariç).
2.  cPanel "Dosya Yöneticisi" (File Manager) aracılığıyla bu ZIP dosyasını sunucunuza yükleyin (genellikle `public_html` veya projeniz için belirlediğiniz bir alt dizine).
3.  Yüklediğiniz ZIP dosyasına sağ tıklayıp "Extract" (Çıkart) seçeneği ile arşivi açın.

### Adım 2: Node.js Uygulaması Oluşturma

1.  cPanel ana menüsünden "Setup Node.js App" aracını bulun ve tıklayın.
2.  "Create Application" butonuna tıklayarak yeni bir uygulama oluşturun.
3.  Formu aşağıdaki gibi doldurun:
    *   **Node.js version:** `20.x.x` veya üzeri bir LTS sürümünü seçin.
    *   **Application mode:** `Production` olarak seçin.
    *   **Application root:** Dosyaları çıkardığınız klasörün yolunu belirtin. Örneğin, `public_html/dijital-andac`.
    *   **Application URL:** Uygulamanızın çalışacağı alan adını veya alt alan adını seçin.
    *   **Application startup file:** Bu alana `node_modules/next/dist/bin/next` yazın. Bu, Next.js'in başlangıç betiğidir.

4.  "Create" butonuna tıklayarak uygulamayı oluşturun.

### Adım 3: Bağımlılıkları Yükleme

Uygulama oluşturulduktan sonra, cPanel size komut çalıştırma arayüzü sunacaktır.

1.  Sayfanın alt kısmındaki "Run NPM Install" butonuna tıklayın.
2.  Bu işlem, `package.json` dosyasında listelenen tüm gerekli kütüphanelerin sunucuya kurulmasını sağlayacaktır. İşlemin tamamlanmasını bekleyin.

### Adım 4: Projeyi Derleme (Build)

Next.js projelerinin canlıda çalışabilmesi için derlenmesi gerekir.

1.  "Setup Node.js App" arayüzünde, uygulamanızın kontrol paneline geri dönün.
2.  "Run JS Script" bölümüne gelin. "Run a Javascript binary" seçeneğini seçin.
3.  Açılan alana `npm run build` yazın ve "Run Script" butonuna tıklayın.
4.  Bu komut, projenizi optimize ederek yayına hazır hale getirecek ve `.next` klasörünü oluşturacaktır. İşlemin başarıyla tamamlandığına dair bir mesaj görene kadar bekleyin.

### Adım 5: Uygulamayı Başlatma

1.  "Setup Node.js App" ekranında, sayfanın üst kısmındaki "Stop App" butonuna ve ardından "Start App" butonuna tıklayarak uygulamanızı yeniden başlatın. Bu, derlenmiş yeni sürümün devreye alınmasını sağlar.

Tebrikler! Uygulamanız artık belirttiğiniz URL üzerinde yayında olmalıdır. Herhangi bir kod değişikliği yaptıktan sonra Adım 4 ve Adım 5'i tekrarlamanız yeterlidir.
