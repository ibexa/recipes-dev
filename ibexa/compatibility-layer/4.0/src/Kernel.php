<?php

declare(strict_types=1);

namespace App;

use Ibexa\Bundle\CompatibilityLayer\Kernel\BundleCompatibilityTrait;
use Ibexa\Bundle\SystemInfo\DependencyInjection\IbexaSystemInfoExtension;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;
    use BundleCompatibilityTrait;

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $container->import('../config/{packages}/*.yaml');
        $container->import('../config/{packages}/' . $this->environment . '/*.yaml');

        if (is_file(\dirname(__DIR__) . '/config/services.yaml')) {
            $container->import('../config/services.yaml');
            $container->import('../config/{services}_' . $this->environment . '.yaml');
        } else {
            $container->import('../config/{services}.php');
        }
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import('../config/{routes}/' . $this->environment . '/*.yaml');
        $routes->import('../config/{routes}/*.yaml');

        if (is_file(\dirname(__DIR__) . '/config/routes.yaml')) {
            $routes->import('../config/routes.yaml');
        } else {
            $routes->import('../config/{routes}.php');
        }

        // Compatibility Layer
        $edition = IbexaSystemInfoExtension::getEditionByPackages();
        if (is_file(\dirname(__DIR__) . '/config/routes/deprecated/ibexa_compatibility_layer_' . $edition . '.yaml')) {
            $routes->import('../config/routes/deprecated/ibexa_compatibility_layer_' . $edition . '.yaml');
        }
    }
}
