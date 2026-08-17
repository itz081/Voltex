import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api')
export class VoltexController {
  constructor(private prisma: PrismaService) {}

  // 1. Obtener todos los supercargadores y productos
  @Get('productos')
  async getProducts() {
    return await this.prisma.product.findMany();
  }

  // 2. Registrar una nueva orden de compra (desde Quick Pay / Checkout)
  @Post('ordenes')
  async createOrder(@Body() body: { userId: number; totalAmount: number; items: any[] }) {
    const nuevaOrden = await this.prisma.order.create({
      data: {
        userId: body.userId || 1, // Usuario por defecto si es invitado
        totalAmount: body.totalAmount,
        status: 'completed',
      },
    });

    // Guardar los detalles de los productos de la orden
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await this.prisma.orderDetail.create({
          data: {
            orderId: nuevaOrden.id,
            productId: item.productId || item.id,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price,
          },
        });
      }
    }

    return { message: '¡Orden registrada con éxito en Pits!', orderId: nuevaOrden.id };
  }

  // 3. Obtener el historial de órdenes por usuario
  @Get('ordenes/usuario/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return await this.prisma.order.findMany({
      where: { userId: Number(userId) },
      include: { orderDetails: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. Iniciar sesión validando con MySQL
  @Post('login')
  async login(@Body() body: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return { success: false, message: 'Piloto no registrado en la base de datos.' };
    }

    return {
      success: true,
      message: '¡Acceso concedido a Pits!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 'admin' o 'client'
      },
    };
  }

  // 2. CREAR UN PRODUCTO NUEVO (¡Este era el que faltaba!)
 @Post('productos')
  async createProduct(@Body() body: {
      name: string;
      description?: string;
      price: number;
      stock?: number;
      marca?: string;
      category: string; // Sigue recibiendo string del frontend
      imageUrl?: string;
  }) {
    return await this.prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: body.price,
        stock: Number(body.stock) || 10,
        marca: body.marca || '',
        category: (body.category as any) || 'karting', // <--- ¡Agregamos 'as any' aquí para que TypeScript no se queje!
        imageUrl: body.imageUrl || 'assets/img/supercargador-default.jpg',
      },
    });
  }

  // 4. Eliminar un producto del inventario por ID
  @Post('productos/eliminar/:id') // O puedes usar @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }

  @Post('productos/actualizar/:id')
  async updateProduct(@Param('id') id: string, @Body() body: { name: string; price: number; stock: number; description?: string }) {
    return await this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        price: Number(body.price),
        stock: Number(body.stock),
        description: body.description,
      },
    });
  }
  // 6. Obtener todas las notificaciones push
  @Get('notifications')
  async getNotifications() {
    return await (this.prisma as any).notification.findMany({
      orderBy: { id: 'desc' },
    });
  }

  // 7. Crear/Programar una notificación push
  @Post('notifications')
  async createNotification(@Body() body: { titulo: string; mensaje: string; horaProgramada: string; tipo?: string }) {
    return await (this.prisma as any).notification.create({
      data: {
        titulo: body.titulo,
        mensaje: body.mensaje,
        horaProgramada: body.horaProgramada || 'Ahora',
        tipo: body.tipo || 'push',
      },
    });
  }
}