---
title: Install Ubuntu dengan Debootstrap
slug: install-ubuntu-dengan-debootstrap
date: 2022-04-21
author: irsyadulibad
description: Tutorial memasang ubuntu menggunakan tool debootstrap
categories:
    - linux
tags:
    - tutorial
    - linux
---

## Pengenalan

Sebelum melakukan pemasangan ubuntu menggunakan _debootstrap way_, alangkah baiknya jika kita mengetahui terlebih dahulu apa itu tool yang bernama **deboostrap**.
\
\
**So, apa itu debootstrap?**
\
Mengutip dari debian wiki, debootstrap didefinisikan sebagai berikut:

> Debootstrap is a tool which will install a Debian base system into a subdirectory of another, already installed system. It doesn't require an installation CD, just access to a Debian repository.

Masih bingung? well, sederhananya ``debootstrap`` adalah sebuah alat untuk melakukan pemasangan distro berbasis debian tanpa harus mendownload file **.iso** ataupun installer berbasis CD lainnya (FYI Ubuntu juga termasuk salah satu distro turunan debian atau biasa disebut _debian based_ ).
\
\
Lalu, apa bedanya _debootstrap_ dengan installer lainnya? jika installer pada umumnya dan terlebih khususnya pada Ubuntu menginstall semua hal yang kadang tidak kita butuhkan (minimalis femboy bilang ini adalah **bloated**), _debootstrap_ melakukan hal sebaliknya. Kita hanya akan dipasangkan tool dasar - dasarnya saja. Hal ini tentu akan membuat distro yang kita pasang akan lebih hemat dalam mengonsumsi memori (pemuja RAM akan bahagia dengan ini), namun disisi lain kita harus menginstall semuanya sendiri dari awal.

> Ibarat merakit PC, kita bebas menentukan komponen apa yang ingin dipasang dan tidak bergantung kepada pihak lain.

## Persyaratan (Requirements)
Sebelum memulai instalasi dan menggunakan _debootstrap_, kita membutuhkan alat dan bahan sebagai berikut:

- **OS debian based**\
    Ini adalah hal wajib karena paket _debootstrap_ hanya bisa berjalan pada OS debian based. Jangan khawatir, kita dapat menjalankan live OS untuk memulai pemasangan.
- **Pengetahuan dasar tentang linux dan perintahnya**\
    Kita akan menggunakan command-command seperti ``dpkg-reconfigure``, ``blkid`` dan lain-lain. Pastikan untuk mempelajari dan paham akan perintah tersebut.
- **Koneksi internet**
- **Kesabaran dan ketelatenan**\
    **disclaimer: tutorial ini tidak cocok untuk anda yang ingin semuanya serba instan

Okay jika hal-hal diatas telah dikuasai dan didapatkan, mari kita lanjutkan step by stepnya dengan langsung melakukan eksekusi pemasangan.

## Eksekusi
Sebelum memulai eksekusi, marilah kita bersenam jari terlebih dahulu
> Karena didalam jari yang kuat, terdapat sebuah ketikan yang akurat dan cepat

Saya asumsikan anda telah melakukan partisi kosong pada drive yang akan digunakan sebagai lokasi pemasangan Ubuntu.

- **Memformat partisi**\
    Kita akan menggunakan filesystem ``ext4``, cukup ketikkan perintah
    ```bash
    sudo mkfs.ext4 /dev/sdX
    ```
    *note: ganti sdX sesuai lokasi partisi yang digunakan, untuk informasi lebih detail baca [artikel ini](https://frameboxxindore.com/id/linux/question-what-is-sda-sdb-and-sdc-in-linux.html)

- **Mount partisi**\
    Mounting berfungsi agar kita bisa mengakses partisi yang sudah diformat tadi
    ```bash
    sudo mount /dev/sdX /mnt
    ```
    Untuk memastikan apakah partisi sudah dapat diakses, kita dapat menggunakan langkah sebagai berikut
    ```bash
    cd /mnt
    ls
    ```
- **Memasang _debootstrap_**\
    Kita memerlukan versi terbaru dari debootstrap untuk menginstall ubuntu versi 20 keatas. Oleh karena itu sangat disarankan untuk mendownloadnya langsung dari repository debian.
    ```bash
    wget -c https://salsa.debian.org/installer-team/debootstrap/-/archive/master/debootstrap-master.zip
    unzip debootstrap-master.zip
    cd debootstrap-master
    ```

- **Menginstall paket dasar**\
    Debootstrap memerlukan akses root untuk menginstall paket-paket dasar yang diperlukan
    ```bash
    su
    export DEBOOTSTRAP_DIR=`pwd`
    ./debootstrap --arch=amd64 jammy /mnt http://archive.ubuntu.com/ubuntu
    exit
    ```
    Ganti `jammy` pada perintah diatas sesuai codename ubuntu yang ingin diinstall, silahkan melihat referensi tersebut pada [artikel ini](https://wiki.ubuntu.com/Releases)

- **Menulis fstab**\
    `fstab` berfungsi agar sistem linux tahu dimana lokasi file sistem, swap, dsb ditempatkan. Jika kita salah menuliskan lokasi tersebut, maka sistem akan mengalami crash setelah booting.
    ```bash
    sudo blkid
    ```
    Lalu akan tampil sebagai berikut ini (contoh):

    ```bash
    /dev/sda3: UUID="c8c2900e-0d7f-43dc-82a5-4253560b8899" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="49858d69-03"
    /dev/sdb4: UUID="b3e73ffe-9fe7-4ee0-acb4-64835d775aa0" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="5dea47d6-04"
    ...
    ```
    Isikan UUID dari partisi yang digunakan pada `fstab`
    ```bash
    sudo nano /mnt/etc/fstab
    ```
    Lalu isi file tersebut seperti berikut ini:
    ```bash
    UUID=c8c2900e-0d7f-43dc-82a5-4253560b8899  /  ext4  defaults,discard  0  0
    # Jika anda membuat partisi swap
    UUID=7d006d6a-d042-4366-b32c-12c7ee13d321  none  swap  sw  0 0
    # Jika partisi home dibuat terpisah
    UUID=0d05081e-0ff9-4c21-a0bd-778b371f7fd7  /home  ext4  noatime,errors=remount-ro  0 2
    ```
    Dari script diatas, anda wajib mengganti UUID pada baris pertama sesuai dengan UUID partisi yang kita dapatkan dari langkah sebelumnya. Baris selanjutnya **opsional** jika anda ingin menambahkan [partisi swap](https://www.sudoway.id/fungsi-partisi-swap-di-linux) dan memisahkan partisi untuk home, jika tidak menggunakan dua hal tersebut anda dapat menghapusnya saja.

- **Mengganti hostname**\
    Hostname berfungsi sebagai alias untuk nama komputer kita, hostname juga akan tampil pada _list devices_ saat kita terhubung pada jaringan.
    ```bash
    sudo nano /mnt/etc/hostname
    ```
    \*isikan sesuai kehendak dan selera
    Lalu tambahkan hostname tersebut pada file `/etc/hosts`
    ```bash
    sudo nano /mnt/etc/hosts
    ```
    Tambahkan script seperti berikut pada baris kedua
    ```bash
    127.0.0.1   hostname
    ::1         hostname
    ```
    \*ganti `hostname` sesuai nama host yang telah diset tadi

- **Chroot pada direktori Ubuntu**\
    Chroot digunakan agar kita bisa mengeksekusi aplikasi dalam ubuntu yang telah diinstall, namun sebelum itu kita perlu mounting `/dev`, `/sys`, dan `/proc` terlebih dahulu.
    ```bash
    sudo mount --bind /dev /mnt/dev
    sudo mount --bind /sys /mnt/sys
    sudo mount --bind /proc /mnt/proc
    ```
    ```bash
    sudo chroot /mnt
    ```

- **Menambahkan repository ekstra**\
    Menambah repository ekstra berfungsi agar kita dapat menginstall lebih banyak aplikasi yang tentunya tidak tersedia pada _main repository_.
    ```bash
    apt-add-repository restricted
    apt-add-repository universe
    apt-add-repository multiverse
    apt update
    ```

- **Konfigurasi locales**\
    Locales digunakan untuk mengatur bahasa
    ```bash
    dpkg-reconfigure locales
    ```
    Pilih bahasa yang digunakan dengan menekan tombol arrow pada keyboard dan spasi untuk ceklis pada bahasa yang dipilih.

- **Konfigurasi zona waktu**
    ```bash
    dpkg-reconfigure tzdata
    ```

- **Memasang kernel linux**\
    Tanpa kernel, Ubuntu yang kita install tidak akan terdeteksi oleh bootloader dan tentunya tidak dapat dijalankan.
    ```bash
    apt install linux-image-generic
    apt install linux-headers-generic
    ```

- **Memasang bootloader**\
    Jika bootloader belum terpasang, kita tidak akan bisa menjalankan OS yang telah terinstall.
    * **Legacy BIOS**
        ```bash
        apt install grub-common
        grub-install /dev/sdX
        update-grub
        ```
    \*ganti `sdX` sesuai drive yang digunakan untuk lokasi bootloader

    * **UEFI BIOS**
        ```bash
        apt install grub-efi
        grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ubuntu --recheck --debug
        update-grub
        ```

- **Memasang network manager**\
    Network manager berfungsi untuk menghubungkan perangkat kita pada jaringan
    ```bash
    apt install network-manager
    ```

- **Memasang display manager**\
    Anda dapat menggunakan berbagai macam display manager seperti:
    * GNOME
        ```bash
        apt install gnome
        ```
    * XFCE
        ```bash
        apt install xfce4
        apt install xfce4-goodies
        ```

- **Set root password**\
    Root password berfungsi agar kita dapat login sebagai administrator
    ```bash
    passwd
    ```
    lalu masukkan password sesuai keinginan

- **Menambahkan user**
    ```bash
    useradd user -m
    passwd user
    gpasswd --add user sudo
    ```

- **Keluar dari chroot**
    ```bash
    exit
    ```

## Penutup
Jika telah melakukan semua langkah diatas, maka selamattt anda telah menginstall Ubuntu menggunakan metode _deboostrap way_. Reboot sistem dan anda dapat menjalankan OS yang telah terinstall.
